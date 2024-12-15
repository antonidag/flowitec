import {
  addEdge,
  Background,
  Controls,
  EdgeMouseHandler,
  NodeMouseHandler,
  OnConnect,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, {
  DragEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

import { FlowEdge, FlowNode, useFlowContext } from "./FlowContext";

const Flow = () => {
  const { nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange } =
    useFlowContext();

  const [clickedNode, setClickedNode] = useState<string | null>(null); // State for clicked node
  const [clickedEdge, setClickedEdge] = useState<string | null>(null); // State for clicked node

  const onConnect = useCallback<OnConnect>(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Ask Winberg how to deal with states, because it seems to not work properly
  const handleNodeClick = useCallback<NodeMouseHandler<FlowNode>>(
    (_event, node) => {
      console.log("Enter Node Click handle fnc");
      setClickedNode(node.id); // Update state with the clicked node's ID
      setClickedEdge(null);
      console.log({ clickedEdge });
      console.log({ clickedNode });
    },
    []
  );
  const handleEdgeClick = useCallback<EdgeMouseHandler<FlowEdge>>(
    (_event, edge) => {
      console.log("Enter Edge Click handle fnc");
      setClickedEdge(edge.id); // Update state with the clicked edge's ID
      setClickedNode(null);
      console.log({ clickedEdge });
      console.log({ clickedNode });
    },
    []
  );

  const handleDoubleClick = useCallback<NodeMouseHandler<FlowNode>>(
    (_event, original) => {
      const updatedNodes = nodes.map((node) => {
        if (node.id === original.id) {
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
    },
    [nodes]
  );

  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    nodeId: string
  ) => {
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

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    nodeId: string
  ) => {
    if (event.key === "Enter") {
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

  const onDrop = useCallback<DragEventHandler>(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (!type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      const newNode: FlowNode = {
        id: `${type}-${nodes.length + 1}`,
        type: "default",
        position,
        data: { label: `${type}`, editing: false },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  const onDragOver = useCallback<DragEventHandler>((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleKeyDownGlobal = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        console.log({ clickedEdge });
        console.log({ clickedNode });
        if (clickedNode) {
          // Remove the clicked node
          setNodes((prevNodes) =>
            prevNodes.filter((node) => node.id !== clickedNode)
          );

          // Reset clickedNode after deletion
          setClickedNode(null);
          setClickedEdge(null);
        }
        if (clickedEdge) {
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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownGlobal);
    return () => {
      window.removeEventListener("keydown", handleKeyDownGlobal);
    };
  }, [handleKeyDownGlobal]);

  return (
    <div style={{ width: "80%" }} onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow<any>
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
                style={{ width: "100px" }}
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
        onNodeDoubleClick={handleDoubleClick}
        style={{ width: "100%", height: "100%" }}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Flow;
