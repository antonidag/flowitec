import { IntegrationContextSchema } from "./schema";

// Function to create suggestions from schema
const createSuggestionsFromSchema = (schema: any, parentKey = "") => {
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

      // If the field is an array, handle its items
      if (schema[key].type === "array" && schema[key].items) {
        if (schema[key].items.type === "object") {
          suggestions.push(
            ...createSuggestionsFromSchema(
              schema[key].items.properties,
              `${fullKey}[]`
            )
          );
        } else {
          // Add suggestions for simple array types
          suggestions.push({
            caption: `${key}[]`,
            value: `${key}[]: `,
            meta: schema[key].items.type || "array item",
            description: schema[key].description || "",
          });
        }
      }
    }
  }

  return suggestions;
};

const getContextFromEditor = (editor: any, pos: any): string[] => {
  const lines = editor.session.getLines(0, pos.row + 1);

  // Debug: Verify lines
  console.log("Editor Lines:", lines);

  if (lines.length > 0) {
    // Ensure `pos.row` is valid
    const currentLine = lines[pos.row] || "";
    console.log("Current Line Content:", currentLine);

    const linePart = currentLine.substring(0, pos.column).trim();
    console.log("Trimmed Line Up to Cursor:", linePart);

    if (!linePart) {
      console.warn("No meaningful content on the current line.");
      return [];
    }

    const path = [];
    const regex = /([a-zA-Z0-9_\-\[\]]+):?/g;
    let match;
    while ((match = regex.exec(linePart))) {
      path.push(match[1]);
    }

    console.log("Context Path:", path);
    return path;
  } else {
    console.warn("No lines available in the editor session.");
    return [];
  }
};


const getSchemaForContext = (schema: any, contextPath: string[]): any => {
  let currentSchema = schema;

  for (const key of contextPath) {
    if (key.endsWith("[]")) {
      const arrayKey = key.replace("[]", "");
      if (currentSchema[arrayKey]?.type === "array") {
        currentSchema = currentSchema[arrayKey].items;
      } else {
        console.error(`Key "${arrayKey}" not found or not an array.`);
        return null;
      }
    } else if (currentSchema[key]?.type === "object") {
      currentSchema = currentSchema[key].properties;
    } else {
      console.error(`Key "${key}" not found or not an object.`);
      return null;
    }
  }

  // Debug final schema
  console.log("Schema Context:", currentSchema);

  return currentSchema;
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
    const contextPath = getContextFromEditor(editor, pos); // Get the current context
    console.log("Parsed Context Path:", contextPath);

    const schemaContext = getSchemaForContext(
      IntegrationContextSchema,
      contextPath
    ); // Find the relevant part of the schema

    if (schemaContext) {
      const contextSuggestions = createSuggestionsFromSchema(schemaContext);
      console.log("Generated Suggestions:", contextSuggestions);
      callback(null, contextSuggestions);
    } else {
      console.warn("No matching schema context found.");
      callback(null, []);
    }
  },
};
