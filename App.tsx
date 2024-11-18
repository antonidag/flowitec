// React imports
import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import * as ace from 'ace-builds';

// Internal imports
import { loadYamlToJson } from './src/helper';

// Schema definition for IntegrationContext and Component
const integrationContextSchema = {
  name: { type: 'string', description: 'Name of the integration context' },
  description: { type: 'string', description: 'Description of the integration context' },
  flow: [
    {
      name: { type: 'string', description: 'Name of the component' },
      optional: { type: 'boolean', description: 'Is the component optional?' },
      entry: { type: 'boolean', description: 'Is this an entry component?' },
      dependsOn: {
        type: 'array',
        items: { type: 'string', description: 'Dependencies of the component' },
      },
    },
  ],
};

// Function to create suggestions from schema
const createSuggestionsFromSchema = (schema: any, parentKey = '') => {
  const suggestions: any[] = [];

  for (const key in schema) {
    if (schema.hasOwnProperty(key)) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      // Add suggestion for the current field
      suggestions.push({
        caption: key,
        value: `${key}: `,
        meta: schema[key].type || 'field',
        description: schema[key].description || '',
      });

      // If the field is an object, recursively generate suggestions
      if (schema[key].type === 'object' && schema[key].properties) {
        suggestions.push(...createSuggestionsFromSchema(schema[key].properties, fullKey));
      }

      // If the field is an array of objects, recursively generate suggestions for array items
      if (schema[key].type === 'array' && schema[key].items && schema[key].items.type === 'object') {
        suggestions.push(...createSuggestionsFromSchema(schema[key].items.properties, `${fullKey}[]`));
      }
    }
  }

  return suggestions;
};

// Custom completer
const schemaCompleter = {
  getCompletions(editor, session, pos, prefix, callback) {
    const contextSuggestions = createSuggestionsFromSchema(integrationContextSchema);
    callback(null, contextSuggestions);
  },
};

// Register the completer
ace.require('ace/ext/language_tools').addCompleter(schemaCompleter);

// React root App
const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [errorOverlay, setErrorOverlay] = useState<string | null>(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onEditorChange = (value: string) => {
    try {
      setErrorOverlay(null);

      // Clear previous annotations
      const editor = ace.edit('texteditor');
      editor.getSession().clearAnnotations();

      // Parse the YAML input
      const igContext = loadYamlToJson(value);

      // Validate and update nodes/edges if the YAML is valid
      if (igContext && igContext.flow) {
        const newNodes = igContext.flow.map((component, index) => ({
          id: component.name,
          data: { label: component.name },
          position: { x: 250, y: 150 * index },
          className: component.entry ? 'input' : '',
          style: component.optional ? { border: '2px dashed gray' } : {},
        }));

        const newEdges = igContext.flow
          .filter((component) => component.dependsOn)
          .flatMap((component) =>
            component.dependsOn.map((dependency) => ({
              id: `${dependency}-${component.name}`,
              source: dependency,
              target: component.name,
              animated: true,
            }))
          );

        setNodes(newNodes);
        setEdges(newEdges);
      }
    } catch (error) {
      console.error('Error parsing YAML:', error);

      // Set an annotation to display the syntax error
      const editor = ace.edit('texteditor');
      editor.getSession().setAnnotations([
        {
          row: getErrorLine(error),
          column: 0,
          text: error.message,
          type: 'error',
        },
      ]);

      // Set the error overlay message
      setErrorOverlay(error.message || 'Unknown error occurred while parsing YAML.');
    }
  };

  const getErrorLine = (error: any): number => {
    if (error.mark && typeof error.mark.line === 'number') {
      return error.mark.line;
    }
    return 0;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <div style={{ width: '50%', position: 'relative' }}>
        <AceEditor
          mode="yaml"
          theme="monokai"
          name="texteditor"
          editorProps={{ $blockScrolling: false }}
          height="100%"
          width="100%"
          showPrintMargin={false}
          onChange={onEditorChange}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
        {errorOverlay && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              right: '10px',
              padding: '10px',
              backgroundColor: 'rgba(255, 0, 0, 0.9)',
              color: 'white',
              borderRadius: '5px',
              fontSize: '0.9em',
              pointerEvents: 'none',
            }}
          >
            {errorOverlay}
          </div>
        )}
      </div>

      <div style={{ width: '50%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          style={{ width: '100%', height: '100%' }}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default App;
