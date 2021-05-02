export default {
  name: "eventOrganiser",
  title: "Event Organiser",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    },
    {
      name: "twitterHandle",
      title: "Twitter Handle",
      description:
        "So that we can link to your twitter account on posts. Should start with '@'.",
      type: "string",
      validation: (Rule) =>
        Rule.optional().custom((handle) =>
          handle[0] === "@" ? true : "Should start with '@'"
        ),
    },
    {
      name: "websiteUrl",
      title: "Website Address",
      description: "Organiser's personal website.",
      type: "url",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "bio",
      title: "Bio",
      type: "array",
      of: [
        {
          title: "Block",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
};
