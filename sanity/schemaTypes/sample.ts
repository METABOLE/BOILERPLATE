import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sample',
  title: 'SAMPLE',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'sample' }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: "Device's name.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'slug.current',
    },
  },
});
