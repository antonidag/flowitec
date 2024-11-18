import { IntegrationContextSchema } from "./schema";

// Function to create suggestions from schema
export const createSuggestionsFromSchema = (schema: any, parentKey = "") => {
  const suggestions: any[] = [];

  for (const key in schema) {
    if (schema.hasOwnProperty(key)) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      // Add suggestion for the current field
      suggestions.push({
        caption: key,
        value: `${key}: `,
        meta: schema[key].type || "field",
        description: schema[key].description || "",
      });

      // If the field is an object, recursively generate suggestions
      if (schema[key].type === "object" && schema[key].properties) {
        suggestions.push(
          ...createSuggestionsFromSchema(schema[key].properties, fullKey)
        );
      }

      // If the field is an array of objects, recursively generate suggestions for array items
      if (
        schema[key].type === "array" &&
        schema[key].items &&
        schema[key].items.type === "object"
      ) {
        suggestions.push(
          ...createSuggestionsFromSchema(
            schema[key].items.properties,
            `${fullKey}[]`
          )
        );
      }
    }
  }

  return suggestions;
};

// Custom completer
export const SchemaCompleter = {
  getCompletions(
    editor: any,
    session: any,
    pos: any,
    prefix: any,
    callback: any
  ) {
    const contextSuggestions = createSuggestionsFromSchema(
      IntegrationContextSchema
    );
    callback(null, contextSuggestions);
  },
};
