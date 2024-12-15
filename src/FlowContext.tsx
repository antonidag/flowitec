import {
  Edge,
  Node,
  OnEdgesChange,
  OnNodesChange,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import React, { createContext, ReactNode, useContext } from "react";

export type FlowNode = Node<{ label: string; editing: boolean }>;
export type FlowEdge = Edge;

type FlowContextType = {
  nodes: FlowNode[];
  setNodes: React.Dispatch<React.SetStateAction<FlowNode[]>>;
  onNodesChange: OnNodesChange<FlowNode>;
  edges: FlowEdge[];
  setEdges: React.Dispatch<React.SetStateAction<FlowEdge[]>>;
  onEdgesChange: OnEdgesChange<FlowEdge>;
};

const FlowContext = createContext<FlowContextType | undefined>(undefined);

interface FlowProviderProps {
  children: ReactNode;
}

export const FlowProvider: React.FC<FlowProviderProps> = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as FlowNode[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as FlowEdge[]);

  return (
    <FlowContext.Provider
      value={{ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export const useFlowContext = (): FlowContextType => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlowContext must be used within a FlowProvider");
  }
  return context;
};
