// Sanity schema definition for the Project document type
const projectSchema = {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "blurb",
      title: "Short Blurb",
      type: "string",
      description: "Single-sentence summary shown in project cards.",
    },
    {
      name: "description",
      title: "Full Description",
      type: "text",
    },
    {
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "demoUrl",
      title: "Live Demo URL",
      type: "url",
    },
    {
      name: "repoUrl",
      title: "Repository URL",
      type: "url",
    },
    {
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "year",
      title: "Year",
      type: "number",
    },
  ],
  preview: {
    select: { title: "title", media: "coverImage" },
  },
};

export default projectSchema;
