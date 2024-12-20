import { useEdges, useNodes, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import YAML from "js-yaml";
import React, { useState } from "react";
import { FlowEdge, FlowNode } from "./Flow";
import { TransferData } from "./Types";

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
  | "Logic App"
  | "Virtual Machines"
  | "Batch"
  | "Event Grid"
  | "Service Bus"
  | "Blob Storage"
  | "File Share"
  | "Azure Machine Learning"
  | "Cognitive Services"
  | "Virtual Network (VNet)"
  | "Load Balancer"
  | "VPN"
  | "Application Gateway"
  | "XML"
  | "JSON"
  | "CSV"
  | "Binary";

const ServiceNode = ({ service }: { service: ServiceType }) => {
  switch (service) {
    case "Web Service":
      return <DraggableNode name={service} imgURL="https://cdn-icons-png.flaticon.com/512/5669/5669390.png" />;
    case "API Management":
      return <DraggableNode name={service} imgURL="https://cdn2.iconfinder.com/data/icons/devops-flat-2/60/API-Management-api-management-cog-gear-website-512.png" />;
    case "Database":
      return <DraggableNode name={service} imgURL="https://cdn-icons-png.flaticon.com/512/9850/9850812.png" />;
    case "Function App":
      return <DraggableNode name={service} imgURL="https://static-00.iconduck.com/assets.00/function-icon-512x484-gukb2n0i.png" />;
    case "Cache":
      return <DraggableNode name={service} imgURL="https://cdn2.iconfinder.com/data/icons/whcompare-isometric-web-hosting-servers/50/database-cache-512.png" />;
    case "Container App":
      return <DraggableNode name={service} imgURL="https://cdn-icons-png.flaticon.com/512/860/860142.png" />;
    case "Logic App":
      return <DraggableNode name={service} imgURL="https://symbols.getvecta.com/stencil_28/43_logic-apps.50018fa8c3.svg" />;
    case "Azure Machine Learning":
      return <DraggableNode name={service} imgURL="https://ms-toolsai.gallerycdn.vsassets.io/extensions/ms-toolsai/vscode-ai/0.47.2024031809/1710754151563/Microsoft.VisualStudio.Services.Icons.Default" />;
    case "Batch":
      return <DraggableNode name={service} imgURL="https://cdn-icons-png.flaticon.com/512/4241/4241580.png" />;
    case "Cognitive Services":
      return <DraggableNode name={service} imgURL="https://symbols.getvecta.com/stencil_27/29_cognative-services.8e53fef966.svg" />;
    case "Blob Storage":
      return <DraggableNode name={service} imgURL="https://static-00.iconduck.com/assets.00/storage-blob-icon-512x454-1n4kla2j.png" />;
    case "Event Grid":
      return <DraggableNode name={service} imgURL="https://ms-azuretools.gallerycdn.vsassets.io/extensions/ms-azuretools/vscode-azureeventgrid/0.1.1/1545069785961/Microsoft.VisualStudio.Services.Icons.Default" />;
    case "File Share":
      return <DraggableNode name={service} imgURL="https://cdn-icons-png.flaticon.com/512/1869/1869460.png" />;
    case "Load Balancer":
      return <DraggableNode name={service} imgURL="https://cdn-icons-png.flaticon.com/512/5880/5880629.png" />;
    case "Service Bus":
      return <DraggableNode name={service} imgURL="https://azure.microsoft.com/svghandler/service-bus/?width=600&height=315" />;
    case "Virtual Machines":
      return <DraggableNode name={service} imgURL="https://cdn-icons-png.flaticon.com/512/11813/11813930.png" />;
    case "Virtual Network (VNet)":
      return <DraggableNode name={service} imgURL="https://symbols.getvecta.com/stencil_28/71_virtual-network.8cd684329b.svg" />;
    case "Application Gateway":
      return <DraggableNode name={service} imgURL="https://symbols.getvecta.com/stencil_28/71_virtual-network.8cd684329b.svg" />;
    case "VPN":
      return <DraggableNode name={service} imgURL="https://symbols.getvecta.com/stencil_28/71_virtual-network.8cd684329b.svg" />;
    case "JSON":
      return <DraggableNode name={service} imgURL="https://cdn-icons-png.flaticon.com/512/6394/6394065.png" />;
    case "XML":
      return <DraggableNode name={service} imgURL="https://cdn-icons-png.flaticon.com/512/5105/5105259.png" />;
    case "CSV":
      return <DraggableNode name={service} imgURL="https://cdn-icons-png.flaticon.com/512/15424/15424745.png" />;
    case "Binary":
      return <DraggableNode name={service} imgURL="https://cdn-icons-png.flaticon.com/512/1541/1541857.png" />;
    default:
      const exhaustiveCheck: never = service;
      throw new Error(`Unhandled service type: ${exhaustiveCheck}`);
  }
};

interface DraggableNodeProps {
  name: string;
  imgURL?: string
}

// Function to convert a string to a color
const nameToHexColor = (name: string): string => {
  // Create a hash from the string
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Convert the hash to a hex color
  const color = `#${((hash >> 24) & 0xff).toString(16).padStart(2, "0")}${((hash >> 16) & 0xff).toString(16).padStart(2, "0")}${((hash >> 8) & 0xff).toString(16).padStart(2, "0")}`;
  return color.slice(0, 7); // Ensure it's a valid 6-character hex color
};

const DraggableNode = ({ name, imgURL }: DraggableNodeProps) => {
  const dynamicColor = nameToHexColor(name);
  const transferData: TransferData = {
    name,
    imgURL,
    color: dynamicColor
  };
  return (
    <div
      draggable
      onDragStart={(event) =>
        event.dataTransfer.setData("application/reactflow", JSON.stringify(transferData))
      }
      style={{
        padding: "10px",
        background: nameToHexColor(name),
        color: "white",
        borderRadius: "5px",
        textAlign: "center",
        cursor: "grab",
      }}
    >
      {name}
      {imgURL && <img src={imgURL} alt={name} draggable="false" width="30" />}
    </div>
  );
};

const CollapsibleSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          padding: "5px",
          background: "#e0e0e0",
          borderRadius: "5px",
        }}
      >
        {title} {isOpen ? "▼" : "▲"}
      </div>
      {isOpen && <div style={{ paddingLeft: "10px", marginTop: "5px" }}>{children}</div>}
    </div>
  );
};
interface FileUploadProps {
  label: string;
  accept: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, accept, onFileChange }) => (
  <div>
    <label htmlFor="fileUpload" style={{ cursor: "pointer", color: "#007acc" }}>
      <b>{label}</b>
    </label>
    <input
      type="file"
      id="fileUpload"
      accept={accept}
      style={{ display: "none" }}
      onChange={onFileChange}
    />
  </div>
);

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const ActionButton: React.FC<ButtonProps> = ({ label, onClick }) => (
  <button onClick={onClick} style={{ cursor: "pointer", color: "#007acc" }}>
    {label}
  </button>
);

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
      <FileUpload label="Load YAML" accept=".yaml,.yml" onFileChange={loadYaml} />
      <ActionButton label="Export YAML" onClick={exportYaml} />
      <br />
      <div style={{ overflowY: "auto" }}>
        <CollapsibleSection title="Compute">
          <ServiceNode service="Web Service" />
          <ServiceNode service="Container App" />
          <ServiceNode service="Function App" />
          <ServiceNode service="Virtual Machines" />
          <ServiceNode service="Batch" />
        </CollapsibleSection>

        <CollapsibleSection title="Integration">
          <ServiceNode service="API Management" />
          <ServiceNode service="Logic App" />
          <ServiceNode service="Event Grid" />
          <ServiceNode service="Service Bus" />
        </CollapsibleSection>

        <CollapsibleSection title="Storage">
          <ServiceNode service="Database" />
          <ServiceNode service="Cache" />
          <ServiceNode service="Blob Storage" />
          <ServiceNode service="File Share" />
        </CollapsibleSection>

        <CollapsibleSection title="AI and Machine Learning">
          <ServiceNode service="Azure Machine Learning" />
          <ServiceNode service="Cognitive Services" />
        </CollapsibleSection>

        <CollapsibleSection title="Networking">
          <ServiceNode service="Virtual Network (VNet)" />
          <ServiceNode service="Load Balancer" />
          <ServiceNode service="VPN" />
          <ServiceNode service="Application Gateway" />
        </CollapsibleSection>

        <CollapsibleSection title="Data Formats and Files">
          <ServiceNode service="XML" />
          <ServiceNode service="JSON" />
          <ServiceNode service="CSV" />
          <ServiceNode service="Binary" />
        </CollapsibleSection>
      </div>


    </div>
  );
};

export default Sidebar;
