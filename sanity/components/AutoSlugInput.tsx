'use client';

import { useEffect, useRef } from 'react';
import type { SlugInputProps } from 'sanity';
import { set, useFormValue } from 'sanity';

type FormPath = (string | number)[];

export type AutoSlugFieldOptions = {
  source?: unknown;
};

function parseSourceFields(source: unknown): FormPath[] {
  if (typeof source === 'string' || typeof source === 'number') {
    return [[source]];
  }

  if (
    Array.isArray(source) &&
    source.every((part) => typeof part === 'string' || typeof part === 'number')
  ) {
    return [source as FormPath];
  }

  return [['name']];
}

function toSlug(parts: (string | undefined)[]): string {
  return parts
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Auto-generates slug from source fields, only when those fields change
 * (never on initial document load).
 */
export function AutoSlugInput(props: SlugInputProps) {
  const { value, onChange, renderDefault, schemaType, readOnly } = props;

  const options = schemaType.options as AutoSlugFieldOptions | undefined;
  const sourceFields = parseSourceFields(options?.source);

  const fieldValues = sourceFields.map((path): string | undefined => {
    const formValue = useFormValue(path);
    return typeof formValue === 'string' ? formValue : undefined;
  });

  const previousValuesRef = useRef<(string | undefined)[] | null>(null);
  const userModifiedRef = useRef(false);

  useEffect(() => {
    const previousValues = previousValuesRef.current;

    // First run: seed baseline values, never patch on load
    if (previousValues === null) {
      const expectedSlug = toSlug(fieldValues);
      if (value?.current && expectedSlug && value.current !== expectedSlug) {
        userModifiedRef.current = true;
      }
      previousValuesRef.current = fieldValues;
      return;
    }

    const valuesChanged = fieldValues.some((val, idx) => val !== previousValues[idx]);
    previousValuesRef.current = fieldValues;

    if (!valuesChanged || readOnly) return;

    const hasValues = fieldValues.some((val) => val);
    if (!hasValues) return;

    const previousExpectedSlug = toSlug(previousValues);
    if (value?.current && previousExpectedSlug && value.current !== previousExpectedSlug) {
      userModifiedRef.current = true;
    }

    if (userModifiedRef.current && value?.current) return;

    const slug = toSlug(fieldValues);
    if (slug && slug !== value?.current) {
      onChange(set({ _type: 'slug', current: slug }));
      userModifiedRef.current = false;
    }
  }, [...fieldValues, value, onChange, readOnly]);

  return renderDefault(props);
}
