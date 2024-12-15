import { useEdges, useNodes, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import YAML from "js-yaml";
import React from "react";
import { FlowEdge, FlowNode } from "./Flow";

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
  | "Function App"
  | "Cache"
  | "Container App"
  | "Logic App";

const ServiceNode = ({ service }: { service: ServiceType }) => {
  switch (service) {
    case "Web Service":
      return <DraggableNode name="Web Service" background="#007acc" imgURL="https://cdn-icons-png.flaticon.com/512/5669/5669390.png" />;
    case "API Management":
      return <DraggableNode name="API Management" background="#ff00ff" imgURL="https://cdn2.iconfinder.com/data/icons/devops-flat-2/60/API-Management-api-management-cog-gear-website-512.png" />;
    case "Database":
      return <DraggableNode name="Database" background="brown" imgURL="https://cdn-icons-png.flaticon.com/512/9850/9850812.png" />;
    case "Function App":
      return <DraggableNode name="Function App" background="orange" imgURL="https://static-00.iconduck.com/assets.00/function-icon-512x484-gukb2n0i.png" />;
    case "Cache":
      return <DraggableNode name="Cache" background="blue" imgURL="https://cdn2.iconfinder.com/data/icons/whcompare-isometric-web-hosting-servers/50/database-cache-512.png" />;
    case "Container App":
      return <DraggableNode name="Container App" background="red" imgURL="https://cdn-icons-png.flaticon.com/512/860/860142.png" />;
    case "Logic App":
      return <DraggableNode name="Logic App" background="green" imgURL="https://symbols.getvecta.com/stencil_28/43_logic-apps.50018fa8c3.svg" />;
    default:
      const exhaustiveCheck: never = service;
      throw new Error(`Unhandled service type: ${exhaustiveCheck}`);
  }
};

interface DraggableNodeProps {
  name: string;
  background: string;
  imgURL?: string
}
const DraggableNode = ({ name, background, imgURL }: DraggableNodeProps) => {
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
      {imgURL && <img src={imgURL} alt="Sometext" draggable="false" width="30" />}
    </div>
  );
};

const Sidebar = () => {
  const nodes = useNodes<FlowNode>();
  const edges = useEdges<FlowEdge>();
  const { setNodes, setEdges } = useReactFlow<FlowNode, FlowEdge>();

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
      <h1>FlowiTec</h1>
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
      <br></br>
      <ServiceNode service="Web Service" />
      <ServiceNode service="API Management" />
      <ServiceNode service="Database" />
      <ServiceNode service="Cache" />
      <ServiceNode service="Function App" />
      <ServiceNode service="Container App" />
      <ServiceNode service="Logic App" />
    </div>
  );
};

export default Sidebar;
