import { useEdges, useNodes, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import YAML from "js-yaml";
import React, { useState } from "react";
import { FlowEdge, FlowNode } from "./Flow";
import { TransferData } from "./Types";
import { TurboNodeData } from "./FlowNode";

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
      return <DraggableNode name={service} imgURL="https://cdn2.iconfinder.com/data/icons/devops-flat-2/60/API-Management-api-management-cog-gear-website-512.png" appRoles={['Proxy','Gateway','Pass-Thru']}/>;
    case "Database":
      return <DraggableNode name={service} imgURL="https://cdn-icons-png.flaticon.com/512/9850/9850812.png" appRoles={['Relation', 'Document', 'Graph', 'Vector']}/>;
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
      return <DraggableNode name={service} imgURL="https://azure.microsoft.com/svghandler/service-bus/?width=600&height=315" appRoles={['Pub-Sub', 'Queue']} />;
    case "Virtual Machines":
      return <DraggableNode name={service} imgURL="https://cdn-icons-png.flaticon.com/512/11813/11813930.png" appRoles={['SFTP', 'FTP', 'Server']}/>;
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
  appRoles?: string[]
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

const DraggableNode = ({ name, imgURL, appRoles }: DraggableNodeProps) => {
  const dynamicColor = nameToHexColor(name);
  const transferData: TurboNodeData = {
    label: name,
    iconUrl :imgURL,
    title: name,
    appRole: appRoles
  };
  return (
    <div
      draggable
      onDragStart={(event) =>
        event.dataTransfer.setData('application/reactflow', JSON.stringify(transferData))
      }
      style={{
        padding: '10px 15px',
        background: `linear-gradient(135deg, ${dynamicColor}, ${shadeColor(dynamicColor, -30)})`,
        color: '#ffffff',
        borderRadius: '12px',
        textAlign: 'center',
        cursor: 'grab',
        boxShadow: `0 0 15px ${dynamicColor}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{name}</span>
      {imgURL && (
        <img
          src={imgURL}
          alt={name}
          draggable="false"
          width="30"
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            border: '2px solid #ffffff',
            borderRadius: '50%',
            boxShadow: `0 0 8px ${dynamicColor}`,
            background: '#1f1f1f',
            padding: '2px',
          }}
        />
      )}
    </div>
  );
};

// Utility function to slightly darken or lighten a hex color
const shadeColor = (color: string, percent: number): string => {
  const num = parseInt(color.slice(1), 16),
    amt = Math.round(2.55 * percent),
    r = (num >> 16) + amt,
    g = ((num >> 8) & 0x00ff) + amt,
    b = (num & 0x0000ff) + amt;
  return `#${(0x1000000 + (r < 255 ? (r < 1 ? 0 : r) : 255) * 0x10000 + (g < 255 ? (g < 1 ? 0 : g) : 255) * 0x100 + (b < 255 ? (b < 1 ? 0 : b) : 255))
    .toString(16)
    .slice(1)}`;
};

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={sectionStyle}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...titleStyle,
          boxShadow: isOpen
            ? '0 0 15px rgba(0, 200, 255, 0.7)'
            : '0 0 8px rgba(0, 200, 255, 0.5)',
        }}
      >
        {title} <span style={arrowStyle}>{isOpen ? '▼' : '▲'}</span>
      </div>
      {isOpen && <div style={contentStyle}>{children}</div>}
    </div>
  );
};


// Styles
const sectionStyle: React.CSSProperties = {
  marginBottom: '15px',
  border: '2px solid #00c8ff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 0 10px rgba(0, 200, 255, 0.5)',
};

const titleStyle: React.CSSProperties = {
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  padding: '10px',
  background: 'linear-gradient(135deg, #1f1f1f, #3f3f3f)',
  color: '#ffffff',
  borderRadius: '12px 12px 0 0',
  textAlign: 'center',
  transition: 'box-shadow 0.3s ease',
};

const arrowStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#00c8ff',
};

const contentStyle: React.CSSProperties = {
  padding: '10px',
  background: '#1f1f1f',
  color: '#ffffff',
  fontSize: '14px',
  borderTop: '1px solid rgba(0, 200, 255, 0.5)',
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
      {/* <FileUpload label="Load YAML" accept=".yaml,.yml" onFileChange={loadYaml} />
      <ActionButton label="Export YAML" onClick={exportYaml} /> */}
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
