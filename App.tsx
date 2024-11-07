import React, { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AceEditor from 'react-ace';
import yaml from 'js-yaml';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

interface FlowComponent {
  name: string;
  service?: string;           // Optional, if service details might be empty
  entry?: boolean;            // Indicates if the component is an entry point
  dependsOn?: string[];       // Array of component names this component depends on
  optional?: boolean;         // Indicates if the component is optional
}

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Function to parse YAML and create nodes and edges
  const parseYamlToFlow = (yamlText: string) => {
    try {
      const parsedData = yaml.load(yamlText);
      console.log(parsedData)

      if (parsedData && parsedData.flow) {
        const newNodes = parsedData.flow.map((component, index) => ({
          id: component.name,
          data: { label: component.name },
          position: { x: 250, y: 150 * index },
          className: component.entry ? 'input' : '',
          style: component.optional ? { border: '2px dashed gray' } : {},
        }));

        const newEdges = parsedData.flow
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
    } catch (e) {
      console.error("Error parsing YAML:", e);
    }
  };

  // Handle editor changes
  const onEditorChange = (value: string) => {
    parseYamlToFlow(value); // Parse the YAML input whenever it changes
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '50%' }}>
        <AceEditor
          mode="javascript"
          theme="monokai"
          name="texteditor"
          editorProps={{ $blockScrolling: false }}
          height="100%"
          width="100%"
          showPrintMargin={false}
          onChange={onEditorChange}
        />
      </div>
      
      <div style={{ width: '50%', position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          style={{ width: '100%', height: '100%' }}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default App;
