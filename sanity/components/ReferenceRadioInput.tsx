'use client';

import { Box, Button, Dialog, Flex, Radio, Stack, Text } from '@sanity/ui';
import { useEffect, useMemo, useState } from 'react';
import type { ObjectInputProps, ObjectSchemaType, Reference } from 'sanity';
import { set, unset, useClient } from 'sanity';

type DocumentDoc = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  [key: string]: unknown;
};

type ReferenceRadioInputOptions = {
  documentType: string;
  documentTitle: string;
  editUrl?: string;
};

/**
 * Génère les labels en français à partir du titre du document
 */
function generateLabels(documentTitle: string) {
  const titleLower = documentTitle.toLowerCase();
  const plural = documentTitle + 's';

  return {
    dialogTitle: `Choisir un ${titleLower}`,
    selectedLabel: `${documentTitle} sélectionné`,
    noSelectionLabel: `Aucun ${titleLower} sélectionné`,
    changeButtonLabel: `Changer de ${titleLower}`,
    chooseButtonLabel: `Choisir un ${titleLower}`,
    emptyMessage: `Aucun "${documentTitle}" trouvé.`,
    emptyMessageType: plural.toLowerCase(),
  };
}

function ReferenceRadioInputComponent(props: ObjectInputProps<Reference, ObjectSchemaType>) {
  const { value, onChange, schemaType } = props;

  // Récupérer les options depuis schemaType.options
  const options = (schemaType.options as ReferenceRadioInputOptions) || {};

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

  // Générer automatiquement les labels
  const labels = generateLabels(documentTitle);

  // Générer l'URL d'édition si elle n'est pas fournie
  const finalEditUrl = editUrl || `/studio/structure/orderable-${documentType}`;
  const client = useClient({ apiVersion: '2024-01-01' });

  const [documents, setDocuments] = useState<DocumentDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(value?._ref);

  useEffect(() => {
    setLoading(true);
    client
      .fetch<DocumentDoc[]>(`*[_type == "${documentType}"] | order(name asc){_id, name, slug}`)
      .then((docs) => setDocuments(docs || []))
      .finally(() => setLoading(false));
  }, [client, documentType]);

  useEffect(() => {
    setSelectedId(value?._ref);
  }, [value?._ref]);

  const currentDocument = useMemo(
    () => documents.find((d) => d._id === value?._ref),
    [documents, value?._ref],
  );

  const handleConfirm = () => {
    if (!selectedId) {
      onChange(unset());
      setDialogOpen(false);
      return;
    }

    const nextValue: Reference = {
      _type: 'reference',
      _ref: selectedId,
    };

    onChange(set(nextValue));
    setDialogOpen(false);
  };

  const handleClear = () => {
    setSelectedId(undefined);
    onChange(unset());
  };

  return (
    <>
      <Flex align="center" gap={3}>
        <Box flex={1}>
          {currentDocument ? (
            <Text>
              {labels.selectedLabel} : <strong>{currentDocument.name}</strong>
            </Text>
          ) : (
            <Text>{labels.noSelectionLabel}</Text>
          )}
        </Box>
        <Button
          mode="ghost"
          text={currentDocument ? labels.changeButtonLabel : labels.chooseButtonLabel}
          tone="primary"
          onClick={() => setDialogOpen(true)}
        />
        {currentDocument && (
          <Button mode="bleed" text="Vider" tone="critical" onClick={handleClear} />
        )}
      </Flex>

      {dialogOpen && (
        <Dialog
          header={labels.dialogTitle}
          id={`${documentType}-radio-dialog`}
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
                {documents.map((document) => {
                  const id = document._id;
                  const checked = selectedId === id;
                  const slugLabel =
                    document.slug?.current && document.slug.current !== ''
                      ? ` (${document.slug.current})`
                      : '';

                  return (
                    <Flex key={id} align="center" as="label" gap={2} padding={2} paddingLeft={1}>
                      <Radio
                        checked={checked}
                        name={`${documentType}-radio`}
                        onChange={() => setSelectedId(id)}
                      />
                      <Text>
                        {document.name || 'Sans titre'}
                        {slugLabel}
                      </Text>
                    </Flex>
                  );
                })}

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
                  <Button
                    disabled={!selectedId}
                    mode="default"
                    text="Valider"
                    tone="primary"
                    onClick={handleConfirm}
                  />
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
 * Factory function pour créer un composant ReferenceRadioInput configuré
 * @param options - Options de configuration du composant
 * @returns Composant React configuré
 */
export function createReferenceRadioInput(options: ReferenceRadioInputOptions) {
  return function ConfiguredReferenceRadioInput(
    props: ObjectInputProps<Reference, ObjectSchemaType>,
  ) {
    return (
      <ReferenceRadioInputComponent {...props} schemaType={{ ...props.schemaType, options }} />
    );
  };
}

/**
 * Composant par défaut qui lit les options depuis schemaType.options
 * Utilisez createReferenceRadioInput pour une configuration explicite
 */
export const ReferenceRadioInput = ReferenceRadioInputComponent;
