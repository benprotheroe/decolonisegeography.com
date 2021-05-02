export default {
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "authors",
      title: "Authors",
      type: "array",
      of: [{ type: "reference", to: { type: "author" } }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "eventOrganiser",
      title: "Event Organiser",
      type: "array",
      of: [{ type: "reference", to: { type: "eventOrganiser" } }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.optional(),
    },
    // {
    //   name: "categories",
    //   title: "Categories",
    //   type: "array",
    //   of: [{ type: "reference", to: { type: "category" } }],
    // },
    {
      name: "publishedAt", //rename to event date
      title: "Event Date", //rename to event date
      type: "datetime",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "location",
      title: "Location",
      type: "geopoint",
      validation: (Rule) => Rule.optional(),
    },
    {
      name: "link",
      title: "Link",
      type: "blockContentEvents",
      validation: (Rule) => Rule.required(),
    },
    
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
     // media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`,
      });
    },
  },
};
