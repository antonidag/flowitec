export const IntegrationContextSchema = {
  name: { type: "string", description: "Name of the integration context" },
  description: {
    type: "string",
    description: "Description of the integration context",
  },
  flow: {
    type: "array",
    description: "List of components in the integration flow",
    items: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of the component" },
        optional: {
          type: "boolean",
          description: "Is the component optional?",
        },
        entry: { type: "boolean", description: "Is this an entry component?" },
        dependsOn: {
          type: "array",
          items: {
            type: "string",
            description: "Dependencies of the component",
          },
        },
      },
    },
  },
};
