import { useEdges, useNodes, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useState } from "react";
import { FlowEdge, FlowNode } from "./Flow";
import { ServiceNode } from "./CustomServiceNode";


const computeServiceNodes: ServiceNode[] = [
  {
    title: 'Web Service',
    category: "Compute",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5669/5669390.png'
  },
  {
    title: 'Function App',
    category: 'Compute',
    iconUrl: 'https://static-00.iconduck.com/assets.00/function-icon-512x484-gukb2n0i.png'
  },
  {
    title: 'Container App',
    category: 'Compute',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/860/860142.png',
  },
  {
    title: 'Virtual Machine',
    category: "Compute",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/11813/11813930.png',
    appRoles: ['SFTP', 'FTP', 'Server']
  }
]
const integrationServiceNodes: ServiceNode[] = [
  {
    title: 'API Management',
    category: "Integration",
    iconUrl: 'https://cdn2.iconfinder.com/data/icons/devops-flat-2/60/API-Management-api-management-cog-gear-website-512.png',
    appRoles: ['Proxy', 'Gateway', 'Pass-Thru']
  },
  {
    title: 'Logic App',
    category: 'Integration',
    iconUrl: 'https://symbols.getvecta.com/stencil_28/43_logic-apps.50018fa8c3.svg'
  },
  {
    title: 'Event Grid',
    category: "Compute",
    iconUrl: 'https://ms-azuretools.gallerycdn.vsassets.io/extensions/ms-azuretools/vscode-azureeventgrid/0.1.1/1545069785961/Microsoft.VisualStudio.Services.Icons.Default'
  },
  {
    title: 'Service Bus',
    category: "Integration",
    iconUrl: 'https://azure.microsoft.com/svghandler/service-bus/?width=600&height=315',
    appRoles: ['Pub-Sub', 'Queue']
  }
]
const storageServiceNodes: ServiceNode[] = [
  {
    title: 'Database',
    category: "Storage",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9850/9850812.png',
    appRoles: ['Relation', 'Document', 'Graph', 'Vector']
  },
  {
    title: 'Cache',
    category: 'Storage',
    iconUrl: 'https://cdn2.iconfinder.com/data/icons/whcompare-isometric-web-hosting-servers/50/database-cache-512.png'
  },
  {
    title: 'Blob Storage',
    category: 'Storage',
    iconUrl: 'https://static-00.iconduck.com/assets.00/storage-blob-icon-512x454-1n4kla2j.png'
  },
  {
    title: 'File Share',
    category: 'Storage',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1869/1869460.png'
  }
]

const networkServiceNodes: ServiceNode[] = [
  {
    title: 'Load Balancer',
    category: 'Network',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5880/5880629.png',
  },
  {
    title: 'Virtual Network',
    category: 'Network',
    iconUrl: 'https://symbols.getvecta.com/stencil_28/71_virtual-network.8cd684329b.svg'
  },
  {
    title: 'Application Gateway',
    category: "Network",
    iconUrl: 'https://symbols.getvecta.com/stencil_28/71_virtual-network.8cd684329b.svg'
  }
]


const dataFormatServiceNodes: ServiceNode[] = [
  {
    title: 'JSON',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/6394/6394065.png',
  },
  {
    title: 'XML',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5105/5105259.png'
  },
  {
    title: 'CSV',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/15424/15424745.png'
  },
  {
    title: 'Binary',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1541/1541857.png'
  }
]

interface DraggableNodeProps {
  name: string;
  imgURL: string
  appRoles?: string[],
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
  const transferData: ServiceNode = {
    label: name,
    iconUrl: imgURL,
    title: name,
    appRoles: appRoles,
    category: 'Compute'
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
      <div style={{ overflowY: "auto" }}>
        <CollapsibleSection title="Compute">
          {computeServiceNodes.map((node) => (
            <DraggableNode name={node.title} imgURL={node.iconUrl} appRoles={node.appRoles} />
          ))
          }
        </CollapsibleSection>

        <CollapsibleSection title="Integration">
          {integrationServiceNodes.map((node) => (
            <DraggableNode name={node.title} imgURL={node.iconUrl} appRoles={node.appRoles} />
          ))
          }
        </CollapsibleSection>

        <CollapsibleSection title="Storage">
          {storageServiceNodes.map((node) => (
            <DraggableNode name={node.title} imgURL={node.iconUrl} appRoles={node.appRoles} />
          ))
          }
        </CollapsibleSection>

        <CollapsibleSection title="Networking">
          {networkServiceNodes.map((node) => (
            <DraggableNode name={node.title} imgURL={node.iconUrl} appRoles={node.appRoles} />
          ))
          }
        </CollapsibleSection>

        <CollapsibleSection title="Data Formats and Files">
          {dataFormatServiceNodes.map((node) => (
            <DraggableNode name={node.title} imgURL={node.iconUrl} appRoles={node.appRoles} />
          ))
          }
        </CollapsibleSection>
      </div>


    </div>
  );
};

export default Sidebar;
