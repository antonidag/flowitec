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
import { loadYamlToJson, convertFlowToYaml } from './src/helper'; // Add `convertFlowToYaml` to handle conversion
import { SchemaCompleter } from './src/editor_suggestions';

// Register the completer
ace.require("ace/ext/language_tools").setCompleters([SchemaCompleter]);

// React root App
const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [errorOverlay, setErrorOverlay] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>(''); // To sync YAML content with editor

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const updateEditorContent = useCallback(() => {
    const flowRepresentation = convertFlowToYaml(nodes, edges); // Generate YAML from nodes and edges
    setEditorContent(flowRepresentation);
    const editor = ace.edit('texteditor');
    editor.setValue(flowRepresentation, 1); // Update editor content
  }, [nodes, edges]);

  const onEditorChange = (value: string) => {
    try {
      setErrorOverlay(null);
      const editor = ace.edit('texteditor');
      editor.getSession().clearAnnotations();

      const igContext = loadYamlToJson(value);

      if (igContext && igContext.flow) {
        const newNodes = [];
        const nodesMap: Record<string, { x: number; y: number }> = {};

        igContext.flow.forEach((component, index) => {
          const position = component.position || { x: 250, y: 150 * index };
          nodesMap[component.name] = position;

          newNodes.push({
            id: component.name,
            data: { label: component.name },
            position,
            style: component.optional
              ? { border: '2px dashed gray' }
              : { border: '1px solid #333' },
          });

          if (component.network) {
            newNodes.push({
              id: `network-${component.name}`,
              data: { label: component.network },
              position: { x: position.x, y: position.y + 35 },
              style: {
                backgroundColor: component.network === 'Public' ? '#add8e6' : '#87CEEB',
                fontWeight: 'bold',
                padding: '5px',
                border: '2px solid #333',
                fontSize: '12px',
              },
            });
          }
        });

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
      const editor = ace.edit('texteditor');
      editor.getSession().setAnnotations([
        {
          row: getErrorLine(error),
          column: 0,
          text: error.message,
          type: 'error',
        },
      ]);

      setErrorOverlay(error.message || 'Unknown error occurred while parsing YAML.');
    }
  };

  const getErrorLine = (error: any): number => {
    if (error.mark && typeof error.mark.line === 'number') {
      return error.mark.line;
    }
    return 0;
  };

  const onNodeDragStop = useCallback(() => {
    updateEditorContent(); // Update YAML when dragging stops
  }, [updateEditorContent]);

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
          value={editorContent}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
            highlightActiveLine: true,
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
              zIndex: '100',
            }}
          >
            {errorOverlay}
          </div>
        )}
      </div>

      <div style={{ width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
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
