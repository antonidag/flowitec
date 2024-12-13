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

import YAML from 'js-yaml';

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [clickedNode, setClickedNode] = useState<string | null>(null); // State for clicked node
  const [clickedEdge, setClickedEdge] = useState<string | null>(null); // State for clicked node

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );


  // Ask Winberg how to deal with states, because it seems to not work properly
  const handleNodeClick = useCallback(
    (event, node) => {
      setClickedNode(node.id); // Update state with the clicked node's ID
      setClickedEdge(null)
      console.log({clickedEdge})
      console.log({clickedNode})
    }, []);
  const handleEdgeClick = useCallback(
    (event, edge) => {
      setClickedEdge(edge.id); // Update state with the clicked edge's ID
      setClickedNode(null)
      console.log({clickedEdge})
      console.log({clickedNode})
    }, []);

  const handleDoubleClick = (event: React.MouseEvent, nodeId: string) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            editing: true, // Enable editing mode
          },
        };
      }
      return node;
    });
    setNodes(updatedNodes);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>, nodeId: string) => {
    const newName = event.target.value;

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              label: newName,
            },
          }
          : node
      )
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, nodeId: string) => {
    if (event.key === 'Enter') {
      handleBlur(nodeId);
    }
  };

  const handleBlur = (nodeId: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              editing: false, // Exit editing mode
            },
          }
          : node
      )
    );
  };

  const loadYaml = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;

          const igContext = YAML.load(content);

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

  const handleKeyDownGlobal = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
          console.log({clickedEdge})
          console.log({clickedNode})
        if (clickedNode) {
          // Remove the clicked node
          setNodes((prevNodes) => prevNodes.filter((node) => node.id !== clickedNode));

          // Reset clickedNode after deletion
          setClickedNode(null);
          setClickedEdge(null);
        }
        if(clickedEdge){
          // Remove the edge
          setEdges((edge) => edge.filter((e) => e.id !== clickedEdge));

          // Reset clickedNode after deletion
          setClickedEdge(null);
          setClickedNode(null);
        }
      }
    },
    [clickedNode]
  );

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => {
      window.removeEventListener('keydown', handleKeyDownGlobal);
    };
  }, [handleKeyDownGlobal]);

  return (

    <div style={{ display: 'flex', height: '100vh' }}>
      {/* This should be an sidebar component */}
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
        {/* This should be an option menu component */}
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
        <button onClick={exportYaml} style={{ cursor: 'pointer', color: '#007acc' }}>
          Export YAML
        </button>

        {/* This should be an service component */}
        <div
          draggable
          onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'Web Service')}
          style={{
            padding: '10px',
            background: '#007acc',
            color: 'white',
            borderRadius: '5px',
            textAlign: 'center',
            cursor: 'grab',
          }}
        >
          Web Service
        </div>
        <div
          draggable
          onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'API Management')}
          style={{
            padding: '10px',
            background: '#007acc',
            color: 'white',
            borderRadius: '5px',
            textAlign: 'center',
            cursor: 'grab',
          }}
        >
          API Management
        </div>
        <div
          draggable
          onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'Database')}
          style={{
            padding: '10px',
            background: '#007acc',
            color: 'white',
            borderRadius: '5px',
            textAlign: 'center',
            cursor: 'grab',
          }}
        >
          Database
        </div>
        <div
          draggable
          onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'Function')}
          style={{
            padding: '10px',
            background: '#007acc',
            color: 'white',
            borderRadius: '5px',
            textAlign: 'center',
            cursor: 'grab',
          }}
        >
          Function App
        </div>
      </div>

      {/* ReactFlow canvas */}
      <div style={{ width: '80%' }} onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              label: node.data.editing ? (
                <input
                  type="text"
                  value={node.data.label}
                  onChange={(e) => handleNameChange(e, node.id)}
                  onBlur={() => handleBlur(node.id)}
                  onKeyDown={(e) => handleKeyDown(e, node.id)}
                  autoFocus
                  style={{ width: '100px' }}
                />
              ) : (
                node.data.label
              ),
            },
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={(event, node) => handleDoubleClick(event, node.id)}
          style={{ width: '100%', height: '100%' }}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default App;
