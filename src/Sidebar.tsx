import "@xyflow/react/dist/style.css";
import React from "react";
import YAML from "js-yaml";

import { FlowNode, useFlowContext } from "./FlowContext";

type FlowYaml = {
  flow: Array<{
    name: string;
    position: { x: number; y: number };
    dependsOn: string[];
  }>;
};

type ServiceType =
  | "Web Service"
  | "API Management"
  | "Database"
  | "Function App";

const ServiceNode = ({ service }: { service: ServiceType }) => {
  switch (service) {
    case "Web Service":
      return <DraggableNode name="Web Service" background="#007acc" />;
    case "API Management":
      return <DraggableNode name="API Management" background="#ff00ff" />;
    case "Database":
      return <DraggableNode name="Database" background="brown" />;
    case "Function App":
      return <DraggableNode name="Function App" background="orange" />;
    default:
      const exhaustiveCheck: never = service;
      throw new Error(`Unhandled service type: ${exhaustiveCheck}`);
  }
};

interface DraggableNodeProps {
  name: string;
  background: string;
}
const DraggableNode = ({ name, background }: DraggableNodeProps) => {
  return (
    <div
      draggable
      onDragStart={(event) =>
        event.dataTransfer.setData("application/reactflow", name)
      }
      style={{
        padding: "10px",
        background,
        color: "white",
        borderRadius: "5px",
        textAlign: "center",
        cursor: "grab",
      }}
    >
      {name}
    </div>
  );
};

const Sidebar = () => {
  const { nodes, setNodes, edges, setEdges } = useFlowContext();

  const loadYaml = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;

          const igContext = YAML.load(content) as FlowYaml;

          if (igContext && igContext.flow) {
            const newNodes: FlowNode[] = [];
            const nodesMap: Record<string, FlowNode> = {};

            igContext.flow.forEach((component: any, index: number) => {
              const position = component.position || { x: 250, y: 150 * index };
              nodesMap[component.name] = position;

              newNodes.push({
                id: component.name,
                data: { label: component.name, editing: false },
                position,
                style: component.optional
                  ? { border: "2px dashed gray" }
                  : { border: "1px solid #333" },
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
          console.error("Error parsing YAML:", error);
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

    const blob = new Blob([yamlString], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "flow.yaml";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        width: "20%",
        padding: "10px",
        background: "#f4f4f4",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* This should be an option menu component */}
      <label
        htmlFor="yamlUpload"
        style={{ cursor: "pointer", color: "#007acc" }}
      >
        <b>Load YAML</b>
      </label>
      <input
        type="file"
        id="yamlUpload"
        accept=".yaml,.yml"
        style={{ display: "none" }}
        onChange={loadYaml}
      />
      <button
        onClick={exportYaml}
        style={{ cursor: "pointer", color: "#007acc" }}
      >
        Export YAML
      </button>

      <ServiceNode service="Web Service" />
      <ServiceNode service="API Management" />
      <ServiceNode service="Database" />
      <ServiceNode service="Function App" />
    </div>
  );
};

export default Sidebar;
