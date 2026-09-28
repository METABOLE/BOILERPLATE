import { IconSample } from '@/components/ui/icons';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sample',
  title: 'SAMPLE',
  type: 'document',
  icon: IconSample,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'sample' }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: "Sample's name.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: "Sample's image.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'slug.current',
      image: 'image',
    },
  },
});
