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

import { loadYamlToJson, convertFlowToYaml } from './src/helper';
import YAML from 'js-yaml';

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [errorOverlay, setErrorOverlay] = useState<string | null>(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const loadYaml = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          setErrorOverlay(null);

          const igContext = loadYamlToJson(content);

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
          setErrorOverlay(error.message || 'Unknown error occurred while parsing YAML.');
        }
      };

      reader.readAsText(file);
    }
  };

  const exportYaml = () => {
    const flow = nodes.map((node) => {
      const dependsOn = edges
        .filter((edge) => edge.target === node.id)
        .map((edge) => edge.source);

      return {
        name: node.id,
        position: { x: node.position.x, y: node.position.y },
        ...(dependsOn.length > 0 && { dependsOn }),
      };
    });

    const yamlString = YAML.dump({ flow });

    const blob = new Blob([yamlString], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flow.yaml';
    link.click();
    URL.revokeObjectURL(url);
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type: 'default',
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '20%',
          padding: '10px',
          background: '#f4f4f4',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <label htmlFor="yamlUpload" style={{ cursor: 'pointer', color: '#007acc' }}>
          <b>Load YAML</b>
        </label>
        <input
          type="file"
          id="yamlUpload"
          accept=".yaml,.yml"
          style={{ display: 'none' }}
          onChange={loadYaml}
        />
        <button
          onClick={exportYaml}
          style={{
            padding: '10px',
            background: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Export YAML
        </button>
        <div
          draggable
          onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'Node')}
          style={{
            padding: '10px',
            background: '#007acc',
            color: 'white',
            borderRadius: '5px',
            textAlign: 'center',
            cursor: 'grab',
          }}
        >
          Drag Node
        </div>
      </div>

      {/* ReactFlow canvas */}
      <div style={{ width: '80%' }} onDrop={onDrop} onDragOver={onDragOver}>
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
