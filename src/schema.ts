interface IntegrationContext {
  name: string;
  description: string;
  flow: Component[];
}
interface Component {
  name: string;
  optional: boolean;
  entry: boolean;
  dependsOn: string[];
}

// Schema definition for IntegrationContext and Component
export const IntegrationContextSchema = {
  name: { type: "string", description: "Name of the integration context" },
  description: {
    type: "string",
    description: "Description of the integration context",
  },
  flow: [
    {
      name: { type: "string", description: "Name of the component" },
      optional: { type: "boolean", description: "Is the component optional?" },
      entry: { type: "boolean", description: "Is this an entry component?" },
      dependsOn: {
        type: "array",
        items: { type: "string", description: "Dependencies of the component" },
      },
    },
  ],
};
