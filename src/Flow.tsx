import {
  addEdge,
  Background,
  Controls,
  Edge,
  EdgeMouseHandler,
  Node,
  NodeMouseHandler,
  OnConnect,
  ReactFlow,
  useReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, {
  DragEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import CustomServiceNode, { ServiceNode } from "./CustomServiceNode";

export type FlowNode = Node<{ label: string; editing: boolean }>;
export type FlowEdge = Edge;

const nodeTypes = {
  turbo: CustomServiceNode,
};
const initialNodes: Node<ServiceNode>[] = [];


const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);
  const { screenToFlowPosition } = useReactFlow();

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
              title: newName,
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
      const transferData = JSON.parse(event.dataTransfer.getData("application/reactflow")) as ServiceNode;

      if (!transferData) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<ServiceNode> = {
        id: `${transferData.title}-${nodes.length + 1}`,
        type: 'turbo',
        position,
        data: { label: `${transferData.label}`, title: transferData.title, iconUrl: transferData.iconUrl,subline: transferData.subline, appRoles: transferData.appRoles,category: "Compute" },
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
            title: node.data.editing ? (
              <input
                type="text"
                value={node.data.title}
                onChange={(e) => handleNameChange(e, node.id)}
                onBlur={() => handleBlur(node.id)}
                onKeyDown={(e) => handleKeyDown(e, node.id)}
                autoFocus
                style={{ width: "100px" }}
              />
            ) : (
              node.data.title
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
        nodeTypes={nodeTypes}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Flow;
