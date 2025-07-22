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
  EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, {
  DragEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import CustomServiceNode, { ServiceNode } from "./CustomServiceNode";
import CustomEdge from "./CustomServiceEdge";
import { computeServiceNodes, integrationServiceNodes, storageServiceNodes, networkServiceNodes, dataFormatServiceNodes, resourceServiceNodes, actionServiceNodes, logicServiceNodes, triggerServiceNodes } from "./Sidebar";

export type FlowNode = Node<{ label: string; editing: boolean, title: string }>;
export type FlowEdge = Edge<{
  middelLabel?: string;
  editing?: boolean;
}>;

const nodeTypes = {
  turbo: CustomServiceNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge
};

export type FlowInput = {
  nodes: MinimalNode[]
  edges: MinimalEdge[]
}

export type MinimalNode = {
  title: string,
  label: string,
  id: string,
  x: number,
  y: number
}

export type MinimalEdge = {
  middleLabel: string,
  id: string,
  source: string,
  target: string
}

const Flow = ({
  isEmbed,
  data,
}: {
  isEmbed: boolean; // Accepts true, false, or undefined
  data?: FlowInput;
}) => {

  // Default empty initial nodes and edges
  const defaultInitialNodes: Node<ServiceNode>[] = [];
  const defaultInitialEdges: FlowEdge[] = [];
  if (isEmbed && data) {
    for (const element of data.nodes) {
      // Find the matching service node based on the title
      let matchedNode;
      // Check in all service node categories
      const allServiceNodes = [
        ...computeServiceNodes,
        ...integrationServiceNodes,
        ...storageServiceNodes,
        ...networkServiceNodes,
        ...dataFormatServiceNodes,
        ...resourceServiceNodes,
        ...triggerServiceNodes,
        ...actionServiceNodes,
        ...logicServiceNodes,
      ];
      matchedNode = allServiceNodes.find((serviceNode) => serviceNode.title === element.label);
      console.log(matchedNode)
      // If a matching node is found, update the category and iconUrl properties
      if (matchedNode) {
        defaultInitialNodes.push({
          type: 'turbo',
          draggable: false,
          data: {
            editing: false,
            category: matchedNode.category, // Set category from matched node
            title: element.title,       // Set title from matched node
            label: element.label,         // You can modify this part as per your requirement
            iconUrl: matchedNode.iconUrl,    // Set iconUrl from matched node
            subline: matchedNode.subline,
            appRoles: matchedNode.appRoles
          },
          id: element.id, // Set an appropriate id here
          position: {
            x: element.x,
            y: element.y
          }
        });
      }
    }
    for (const element of data.edges) {
      defaultInitialEdges.push({
        type: 'custom',
        id: element.id,
        source: element.source,
        target: element.target,
        data: {
          editing: false,
          middelLabel: element.middleLabel
        }
      })
    }
  }
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultInitialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultInitialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const [clickedEdge, setClickedEdge] = useState<string | null>(null);
  const onConnect = useCallback<OnConnect>(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'custom',
            data: {
              editing: false,
            }
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const handleEdgeDoubleClick = useCallback<EdgeMouseHandler<FlowEdge>>(
    (_event, original) => {
      const updatedEdges = edges.map((edge) => {
        if (edge.id === original.id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              editing: true, // Enable editing mode
            },
          };
        }
        return edge;
      });
      setEdges(updatedEdges);
    },
    [edges, setEdges]
  );

  const handleEdgeLabelChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    edgeId: string
  ) => {
    const newLabel = event.target.value;

    setEdges((prevEdges) =>
      prevEdges.map((edge) =>
        edge.id === edgeId
          ? {
            ...edge,
            data: {
              ...edge.data,
              middelLabel: newLabel,
            },
          }
          : edge
      )
    );
  };

  const handleEdgeBlur = (edgeId: string) => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) =>
        edge.id === edgeId
          ? {
            ...edge,
            data: {
              ...edge.data,
              editing: false, // Exit editing mode
            },
          }
          : edge
      )
    );
  };


  // Ask Winberg how to deal with states, because it seems to not work properly
  const handleNodeClick = useCallback<NodeMouseHandler<FlowNode>>(
    (_event, node) => {
      setClickedNode(node.id); // Update state with the clicked node's ID
      setClickedEdge(null);
    },
    []
  );
  const handleEdgeClick = useCallback<EdgeMouseHandler<FlowEdge>>(
    (_event, edge) => {
      setClickedEdge(edge.id); // Update state with the clicked edge's ID
      setClickedNode(null);
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


  const handleKeyDownEdge = (
    event: React.KeyboardEvent<HTMLInputElement>,
    edgeId: string
  ) => {
    if (event.key === "Enter") {
      handleEdgeBlur(edgeId);
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
        data: { label: `${transferData.label}`, title: transferData.title, iconUrl: transferData.iconUrl, subline: transferData.subline, appRoles: transferData.appRoles, category: transferData.category },
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

  const { fitView } = useReactFlow();
  useEffect(() => {
    // Auto-zoom when nodes or edges change
    if (isEmbed)
      fitView({ padding: 0.1, duration: 800 });
  }, [nodes, edges, fitView]); // Re-trigger zoom when nodes or edges are updated

  return (


    <div style={{ width: isEmbed ? "100%" : "80%" }} onDrop={onDrop} onDragOver={onDragOver}>
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
        edges={edges.map((edge) => ({
          ...edge,
          data: {
            ...edge.data,
            middelLabel: edge.data?.editing ? (
              <input
                type="text"
                value={edge.data?.middelLabel ?? ''}
                onChange={(e) => handleEdgeLabelChange(e, edge.id)}
                onBlur={() => handleEdgeBlur(edge.id)}
                onKeyDown={(e) => handleKeyDownEdge(e, edge.id)}
                autoFocus
                style={{ width: "100px", padding: "5px" }}
              />
            ) : (
              edge.data?.middelLabel ?? ''
            ),
          },
        }))}

        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={handleDoubleClick}
        onEdgeDoubleClick={handleEdgeDoubleClick}
        style={{ width: "100%", height: "100%" }}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        {!isEmbed ? <Controls /> : <></>}
        <Background />
      </ReactFlow>

    </div>
  );
};

export default Flow;
