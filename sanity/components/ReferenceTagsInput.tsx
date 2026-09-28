'use client';

import { Box, Button, Dialog, Flex, Stack, Text } from '@sanity/ui';
import type { ComponentType } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { ArrayOfObjectsInputProps, ArraySchemaType } from 'sanity';
import { set, unset, useClient } from 'sanity';

type DocumentDoc = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  [key: string]: unknown;
};

type ReferenceTagsInputOptions = {
  documentType: string;
  documentTitle: string;
  editUrl?: string;
};

type ReferenceValue = {
  _type: string;
  _ref: string;
  _key: string;
};

/**
 * Génère les labels en français à partir du titre du document
 */
function generateLabels(documentTitle: string) {
  const titleLower = documentTitle.toLowerCase();
  const plural = documentTitle + 's';

  return {
    dialogTitle: `Choisir des ${titleLower}s`,
    selectedLabel: `sélectionné(s)`,
    noSelectionLabel: `Aucun ${titleLower} sélectionné`,
    changeButtonLabel: `Modifier les ${titleLower}s`,
    chooseButtonLabel: `Choisir des ${titleLower}s`,
    emptyMessage: `Aucun "${documentTitle}" trouvé.`,
    emptyMessageType: plural.toLowerCase(),
  };
}

function ReferenceTagsInputComponent(
  props: ArrayOfObjectsInputProps<ReferenceValue, ArraySchemaType>,
) {
  const { value, onChange, schemaType } = props;

  const options = (schemaType.options as ReferenceTagsInputOptions) || {};

  const { documentType, documentTitle, editUrl } = options;

  if (!documentType || !documentTitle) {
    return (
      <Box padding={3}>
        <Text size={1} style={{ color: 'red' }}>
          Erreur : documentType et documentTitle doivent être définis dans les options du champ.
        </Text>
      </Box>
    );
  }

  const labels = generateLabels(documentTitle);

  const finalEditUrl = editUrl || `/studio/structure/orderable-${documentType}`;
  const client = useClient({ apiVersion: '2024-01-01' });

  const [documents, setDocuments] = useState<DocumentDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentIds = useMemo(() => {
    if (!value || !Array.isArray(value)) return [];
    return value.map((ref) => ref._ref);
  }, [value]);

  const [selectedIds, setSelectedIds] = useState<string[]>(currentIds);

  useEffect(() => {
    setLoading(true);
    client
      .fetch<DocumentDoc[]>(`*[_type == "${documentType}"] | order(name asc){_id, name, slug}`)
      .then((docs) => setDocuments(docs || []))
      .finally(() => setLoading(false));
  }, [client, documentType]);

  useEffect(() => {
    setSelectedIds(currentIds);
  }, [currentIds]);

  const selectedDocuments = useMemo(
    () =>
      documents
        .filter((d) => currentIds.includes(d._id))
        .map((d) => d.name || 'Sans titre')
        .join(', '),
    [documents, currentIds],
  );

  const handleToggle = (docId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(docId)) {
        return prev.filter((id) => id !== docId);
      }
      return [...prev, docId];
    });
  };

  const handleConfirm = () => {
    if (selectedIds.length === 0) {
      onChange(unset());
      setDialogOpen(false);
      return;
    }

    const references: ReferenceValue[] = selectedIds.map((id, index) => ({
      _type: 'reference',
      _ref: id,
      _key: `ref-${id}-${Date.now()}-${index}`,
    }));

    onChange(set(references));
    setDialogOpen(false);
  };

  const handleClear = () => {
    setSelectedIds([]);
    onChange(unset());
  };

  return (
    <>
      <Flex align="center" gap={3}>
        <Box flex={1}>
          {selectedDocuments ? (
            <Text>
              {documentTitle} {labels.selectedLabel} : <strong>{selectedDocuments}</strong>
            </Text>
          ) : (
            <Text>{labels.noSelectionLabel}</Text>
          )}
        </Box>
        <Button
          mode="ghost"
          text={selectedDocuments ? labels.changeButtonLabel : labels.chooseButtonLabel}
          tone="primary"
          onClick={() => setDialogOpen(true)}
        />
        {selectedDocuments && (
          <Button mode="bleed" text="Vider" tone="critical" onClick={handleClear} />
        )}
      </Flex>

      {dialogOpen && (
        <Dialog
          header={labels.dialogTitle}
          id={`${documentType}-tags-dialog`}
          width={1}
          onClose={() => setDialogOpen(false)}
        >
          <Box padding={4}>
            {loading && <Text>Chargement…</Text>}

            {!loading && documents.length === 0 && (
              <Text>{labels.emptyMessage} Créez-en un dans le studio, puis réessayez.</Text>
            )}

            {!loading && documents.length > 0 && (
              <Stack space={3}>
                <Flex gap={2} wrap="wrap">
                  {documents.map((document) => {
                    const id = document._id;
                    const checked = selectedIds.includes(id);
                    const slugLabel =
                      document.slug?.current && document.slug.current !== ''
                        ? ` (${document.slug.current})`
                        : '';

                    return (
                      <Button
                        key={id}
                        mode={checked ? 'default' : 'ghost'}
                        text={`${document.name || 'Sans titre'}${slugLabel}`}
                        tone="primary"
                        onClick={() => handleToggle(id)}
                      />
                    );
                  })}
                </Flex>

                <Box marginTop={1}>
                  <Text size={1}>
                    <a href={finalEditUrl} style={{ textDecoration: 'underline' }}>
                      Modifier les {labels.emptyMessageType}
                    </a>
                  </Text>
                </Box>

                <Flex gap={3} marginTop={4}>
                  <Button
                    mode="ghost"
                    text="Annuler"
                    tone="default"
                    onClick={() => setDialogOpen(false)}
                  />
                  <Button mode="default" text="Valider" tone="primary" onClick={handleConfirm} />
                </Flex>
              </Stack>
            )}
          </Box>
        </Dialog>
      )}
    </>
  );
}

/**
 * Factory function pour créer un composant ReferenceTagsInput configuré
 * @param options - Options de configuration du composant
 * @returns Composant React configuré
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createReferenceTagsInput(options: ReferenceTagsInputOptions): ComponentType<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function ConfiguredReferenceTagsInput(props: any) {
    return <ReferenceTagsInputComponent {...props} schemaType={{ ...props.schemaType, options }} />;
  }
  return ConfiguredReferenceTagsInput;
}

/**
 * Composant par défaut qui lit les options depuis schemaType.options
 * Utilisez createReferenceTagsInput pour une configuration explicite
 */
export const ReferenceTagsInput = ReferenceTagsInputComponent;
