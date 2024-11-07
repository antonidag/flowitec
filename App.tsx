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

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';


const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 0' },
    position: { x: 250, y: 5 },
    className: 'light',
  },
  {
    id: '2',
    data: { label: 'Group A' },
    position: { x: 100, y: 100 },
    className: 'light',
    style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 200, height: 200 },
  }
];
 
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

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
