import "@xyflow/react/dist/style.css";
import React, { useState } from "react";
import { ServiceCategory, ServiceNode } from "./CustomServiceNode";
import { useReactFlow } from "@xyflow/react";
import { FlowNode, MinimalEdge, MinimalNode } from "./Flow";
import { FaSearch as FaSearchAny } from 'react-icons/fa';

const FaSearch = FaSearchAny as any;




export const computeServiceNodes: ServiceNode[] = [
  {
    title: 'Web Service',
    category: "Compute",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/10838/10838328.png',
  },
  {
    title: 'Function',
    category: 'Compute',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/18417/18417702.png',
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
  },
  {
    title: 'Application',
    category: "Compute",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5669/5669390.png',
  },
  {
    title: 'Kubernetes Cluster',
    category: "Compute",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/919/919825.png',
  },
  {
    title: 'App Service Plan',
    category: "Compute",
    iconUrl: 'https://symbols.getvecta.com/stencil_28/77_app-service-plan.83c02a3a41.svg',
  },
  {
    title: 'Batch Service',
    category: "Compute",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3926/3926092.png',
  },
  {
    title: 'Cloud Run',
    category: "Compute",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2942/2942091.png',
  },
];

export const integrationServiceNodes: ServiceNode[] = [
  {
    title: 'API Management',
    category: "Integration",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/18033/18033070.png',
  },
  {
    title: 'Logic App',
    category: 'Integration',
    iconUrl: 'https://symbols.getvecta.com/stencil_28/43_logic-apps.50018fa8c3.svg',
  },
  {
    title: 'Event Grid',
    category: "Integration",
    iconUrl: 'https://ms-azuretools.gallerycdn.vsassets.io/extensions/ms-azuretools/vscode-azureeventgrid/0.1.1/1545069785961/Microsoft.VisualStudio.Services.Icons.Default',
  },
  {
    title: 'Service Bus',
    category: "Integration",
    iconUrl: 'https://azure.microsoft.com/svghandler/service-bus/?width=600&height=315',
  },
  {
    title: 'Service Connector',
    category: "Integration",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2921/2921828.png', // generic connector icon
  },
  {
    title: 'Azure Functions',
    category: "Integration",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/888/888857.png',
  },
  {
    title: 'Data Factory',
    category: "Integration",
    iconUrl: 'https://azurecomcdn.azureedge.net/cvt-78b1c0bb35db9211783e6519a23b01a32e9a4422f65dd91eb63c5e7bb1a1aa0b/images/page/services/data-factory/data-factory.svg',
  },
  {
    title: 'Event Hubs',
    category: "Integration",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/906/906324.png',
  },
  {
    title: 'API Gateway',
    category: "Integration",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828645.png',
  },
  {
    title: 'Hybrid Connection',
    category: "Integration",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/427/427735.png', // example icon
  },
];

export const storageServiceNodes: ServiceNode[] = [
  {
    title: 'Database',
    category: "Storage",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9850/9850812.png',
  },
  {
    title: 'Cache',
    category: 'Storage',
    iconUrl: 'https://cdn2.iconfinder.com/data/icons/whcompare-isometric-web-hosting-servers/50/database-cache-512.png',
  },
  {
    title: 'Blob Storage',
    category: 'Storage',
    iconUrl: 'https://static-00.iconduck.com/assets.00/storage-blob-icon-512x454-1n4kla2j.png',
  },
  {
    title: 'File Share',
    category: 'Storage',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1869/1869460.png',
  },
  {
    title: 'Queue Storage',
    category: 'Storage',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/126/126509.png',
  },
  {
    title: 'Table Storage',
    category: 'Storage',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1097/1097958.png',
  },
  {
    title: 'CDN (Content Delivery Network)',
    category: 'Storage',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/888/888857.png',
  },
  {
    title: 'Backup',
    category: 'Storage',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/833/833314.png',
  },
  {
    title: 'Data Lake',
    category: 'Storage',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3416/3416653.png',
  },
  {
    title: 'Archive Storage',
    category: 'Storage',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5974/5974412.png',
  },
];


export const networkServiceNodes: ServiceNode[] = [
  {
    title: 'Load Balancer',
    category: 'Network',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5880/5880629.png',
  },
  {
    title: 'Virtual Network',
    category: 'Network',
    iconUrl: 'https://symbols.getvecta.com/stencil_28/71_virtual-network.8cd684329b.svg',
  },
  {
    title: 'Application Gateway',
    category: "Network",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2581/2581805.png',
  },
  {
    title: 'Firewall',
    category: 'Network',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/565/565547.png',
  },
  {
    title: 'VPN Gateway',
    category: 'Network',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2467/2467937.png',
  },
  {
    title: 'DNS',
    category: 'Network',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png',
  },
  {
    title: 'Network Interface',
    category: 'Network',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1170/1170576.png',
  },
  {
    title: 'ExpressRoute',
    category: 'Network',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2921/2921819.png',
  },
  {
    title: 'Gateway',
    category: 'Network',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995563.png',
  },
  {
    title: 'Subnets',
    category: 'Network',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2942/2942780.png',
  },
  {
    title: 'Network Security Group',
    category: 'Network',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/565/565561.png',
  },
];



export const dataFormatServiceNodes: ServiceNode[] = [
  {
    title: 'JSON',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/14535/14535271.png',
  },
  {
    title: 'XML',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/337/337959.png',
  },
  {
    title: 'CSV',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/8242/8242984.png',
  },
  {
    title: 'Binary',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3143/3143509.png',
  },
  {
    title: 'HTML',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/136/136528.png',
  },
  {
    title: 'YAML',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/136/136539.png',
  },
  {
    title: 'Avro',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4140/4140379.png',
  },
  {
    title: 'Parquet',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3209/3209979.png',
  },
  {
    title: 'Protocol Buffers',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1055/1055646.png',
  },
  {
    title: 'INI',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  },
  {
    title: 'Markdown',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2111/2111500.png',
  },
  {
    title: 'Peppol',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1962/1962038.png', // generic network icon
  },
  {
    title: 'EDIFACT',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2040/2040887.png', // generic document icon
  },
  {
    title: 'X12',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1962/1962038.png', // reuse network icon
  },
  {
    title: 'HL7',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3176/3176303.png', // health related icon
  },
  {
    title: 'Flat File',
    category: "Data Formats",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1517/1517712.png', // text file icon
  }
];



export const resourceServiceNodes: ServiceNode[] = [
  {
    title: 'Page',
    category: "Resource",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/18544/18544859.png',
  },
  {
    title: 'End-point',
    category: "Resource",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828881.png'
  },
  {
    title: 'Policy',
    category: "Resource",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/8040/8040938.png'
  },
  {
    title: 'Form',
    category: "Resource",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828911.png'
  },
  {
    title: 'Table',
    category: "Resource",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828912.png'
  },
  {
    title: 'Dashboard',
    category: "Resource",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048976.png'
  },
  {
    title: 'Report',
    category: "Resource",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048977.png'
  },
  {
    title: 'Widget',
    category: "Resource",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048978.png'
  }
];

export const triggerServiceNodes: ServiceNode[] = [
  {
    title: 'Webhook Trigger',
    category: "Trigger",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png'
  },
  {
    title: 'Schedule Trigger',
    category: "Trigger",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png'
  },
  {
    title: 'Event Trigger',
    category: "Trigger",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048963.png'
  },
  {
    title: 'HTTP Trigger',
    category: "Trigger",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/159/159469.png'
  },
  {
    title: 'Timer Trigger',
    category: "Trigger",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3103/3103446.png'
  },
  {
    title: 'Queue Trigger',
    category: "Trigger",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/710/710692.png'
  },
  {
    title: 'Blob Trigger',
    category: "Trigger",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2834/2834382.png'
  },
  {
    title: 'Service Bus Trigger',
    category: "Trigger",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/906/906175.png'
  },
  {
    title: 'File System Trigger',
    category: "Trigger",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/833/833524.png'
  },
  {
    title: 'Email Trigger',
    category: "Trigger",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/561/561127.png'
  },
  {
    title: 'Database Trigger',
    category: "Trigger",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9850/9850812.png'
  },
  {
    title: 'IoT Trigger',
    category: "Trigger",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2222/2222607.png'
  },
  {
    title: 'Custom Trigger',
    category: "Trigger",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/189/189792.png'
  }
];


export const actionServiceNodes: ServiceNode[] = [
  {
    title: 'HTTP Request',
    category: "Action",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1880/1880115.png' // API / HTTP icon
  },
  {
    title: 'SMTP',
    category: "Action",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/16464/16464288.png' // email icon
  },
  {
    title: 'FTP Upload',
    category: "Action",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1091/1091223.png' // upload icon
  },
  {
    title: 'SFTP Transfer',
    category: "Action",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/8110/8110721.png' // lock+transfer icon (secure FTP)
  },
  {
    title: 'WebSocket',
    category: "Action",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/7917/7917694.png' // websocket or network icon
  },
  {
    title: 'MQTT',
    category: "Action",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2581/2581807.png' // publish or message icon
  },
  {
    title: 'SOAP Request',
    category: "Action",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/6966/6966724.png' // SOAP / XML icon
  },
  {
    title: 'gRPC Call',
    category: "Action",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1006/1006552.png' // grpc / communication icon
  },
  {
    title: 'Run Script',
    category: "Action",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2581/2581053.png' // script / code icon
  }
];


export const logicServiceNodes: ServiceNode[] = [
  {
    title: 'Condition',
    category: "Logic",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4500/4500935.png'
  },
  {
    title: 'Loop',
    category: "Logic", 
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1102/1102264.png'
  },
  {
    title: 'While',
    category: "Logic",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1102/1102365.png' // loop/repeat icon representing while
  },
  {
    title: 'Switch',
    category: "Logic",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/6855/6855509.png'
  },
  {
    title: 'Delay',
    category: "Logic",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/18670/18670701.png'
  },
  {
    title: 'Try',
    category: "Logic",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/6237/6237846.png'
  },
  {
    title: 'Catch',
    category: "Logic",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9997/9997675.png'
  },
  {
    title: 'Break',
    category: "Logic",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/10100/10100000.png'
  },
  {
    title: 'Continue',
    category: "Logic",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/6067/6067034.png'
  },
  {
    title: 'Parallel',
    category: "Logic",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/6062/6062667.png'
  },
  {
    title: 'Wait Until',
    category: "Logic",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/16445/16445165.png'
  },
  {
    title: 'Compose',
    category: "Logic",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3985/3985423.png' // compose or build icon
  }
];


interface DraggableNodeProps {
  name: string;
  imgURL: string
  appRoles?: string[],
  category: ServiceCategory
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

const DraggableNode = ({ name, imgURL, appRoles, category }: DraggableNodeProps) => {
  const dynamicColor = nameToHexColor(category);
  const transferData: ServiceNode = {
    label: name,
    iconUrl: imgURL,
    title: name,
    appRoles: appRoles,
    category: category
  };
  return (
    <div
      draggable
      onDragStart={(event) =>
        event.dataTransfer.setData('application/reactflow', JSON.stringify(transferData))
      }
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 18px',
        background: `linear-gradient(90deg, ${dynamicColor} 0%, ${shadeColor(dynamicColor, -20)} 100%)`,
        color: '#fff',
        borderRadius: '50px',
        cursor: 'grab',
        boxShadow: `0 2px 12px ${dynamicColor}55`,
        position: 'relative',
        minWidth: '140px',
        transition: 'box-shadow 0.2s, background 0.2s',
        border: '1.5px solid #222c3c',
        fontWeight: 600,
        fontSize: '16px',
        userSelect: 'none',
      }}
      onMouseOver={e => (e.currentTarget.style.boxShadow = `0 4px 24px ${dynamicColor}`)}
      onMouseOut={e => (e.currentTarget.style.boxShadow = `0 2px 12px ${dynamicColor}55`)}
    >
      {imgURL && (
        <img
          src={imgURL}
          alt={name}
          draggable="false"
          width="40"
          height="40"
          style={{
            border: '2px solid #fff',
            borderRadius: '50%',
            boxShadow: `0 0 12px ${dynamicColor}`,
            background: '#23272f',
            padding: '3px',
            marginRight: '8px',
          }}
        />
      )}
      <span style={{ fontWeight: 700, fontSize: '16px', flex: 1 }}>{name}</span>
    </div>
  );
}

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
  marginBottom: '22px',
  border: 'none',
  borderRadius: '18px',
  overflow: 'hidden',
  boxShadow: '0 2px 18px 0 rgba(0,200,255,0.10)',
  background: 'rgba(44, 54, 74, 0.97)',
  transition: 'box-shadow 0.2s',
};

const titleStyle: React.CSSProperties = {
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '18px',
  padding: '16px 0',
  background: 'linear-gradient(90deg, #23272f 0%, #313a49 100%)',
  color: '#00c8ff',
  borderRadius: '18px 18px 0 0',
  textAlign: 'center',
  letterSpacing: '0.5px',
  boxShadow: '0 2px 12px #222c3c',
  transition: 'box-shadow 0.2s',
  userSelect: 'none',
};

const arrowStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#00c8ff',
  marginLeft: '10px',
};

const contentStyle: React.CSSProperties = {
  padding: '18px 12px',
  background: 'rgba(44, 54, 74, 0.99)',
  color: '#f5f6fa',
  fontSize: '16px',
  borderTop: '1px solid #222c3c',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  transition: 'max-height 0.4s cubic-bezier(.4,0,.2,1)',
};

const sidebarStyle: React.CSSProperties = {
  width: '220px',
  minWidth: '180px',
  padding: '12px 8px',
  background: 'rgba(34, 40, 49, 0.85)',
  boxShadow: '2px 0 32px 0 rgba(0,0,0,0.18)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  color: '#f5f6fa',
  fontFamily: 'Segoe UI, Arial, sans-serif',
  borderRight: '1.5px solid #222c3c',
  height: '100vh',
  overflow: 'hidden',
  backdropFilter: 'blur(12px)',
};

const headerStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  textAlign: 'center',
  color: '#00c8ff',
  marginBottom: '4px',
  letterSpacing: '1px',
  textShadow: '0 2px 8px #222c3c',
};

const searchBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(44,54,74,0.95)',
  borderRadius: '8px',
  padding: '4px 8px',
  marginBottom: '6px',
  boxShadow: '0 1px 4px #222c3c',
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  background: 'transparent',
  color: '#f5f6fa',
  fontSize: '13px',
  outline: 'none',
  marginLeft: '4px',
};

const iconGridStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '4px 0',
  minHeight: '60px',
  maxHeight: 'calc(100vh - 120px)',
  overflowY: 'auto',
  overflowX: 'hidden',
  marginTop: '8px',
  position: 'relative',
};

const tooltipStyle: React.CSSProperties = {
  position: 'fixed',
  transform: 'translateX(-50%)',
  background: 'rgba(34,40,49,0.97)',
  color: '#00c8ff',
  padding: '7px 14px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  boxShadow: '0 2px 8px #00c8ff33',
  zIndex: 99999,
  pointerEvents: 'none',
  opacity: 0,
  transition: 'opacity 0.2s',
  width: 'max-content',
  minWidth: 'fit-content',
  visibility: 'hidden',
};

const tooltipArrowStyle: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '100%',
  transform: 'translateX(-50%)',
  width: 0,
  height: 0,
  borderLeft: '8px solid transparent',
  borderRight: '8px solid transparent',
  borderTop: '10px solid rgba(34,40,49,0.97)',
  zIndex: 100,
};

const iconGridBoxStyle: React.CSSProperties = {
  background: 'rgba(44,54,74,0.97)',
  borderRadius: '12px',
  boxShadow: '0 1px 8px 0 rgba(0,200,255,0.10)',
  border: '1px solid #222c3c',
  padding: '8px 4px',
  margin: '4px 0 0 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  overflow: 'visible',
}

const categoryLabelStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'left',
  fontWeight: 500,
  fontSize: '13px',
  color: '#00c8ff',
  margin: '8px 0 2px 4px',
  letterSpacing: '0.5px',
  textShadow: '0 1px 4px #222c3c',
};

const categoryDividerStyle: React.CSSProperties = {
  width: '90%',
  height: '1px',
  background: 'linear-gradient(90deg, #00c8ff 0%, #23272f 100%)',
  borderRadius: '1px',
  margin: '2px 0 6px 0',
  opacity: 0.2,
};

const sectionContainerStyle: React.CSSProperties = {
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 140px)',
  paddingRight: '6px',
  scrollbarWidth: 'thin',
  scrollbarColor: '#00c8ff #23272f',
  background: 'none',
};

const buttonStyle: React.CSSProperties = {
  padding: '7px 12px',
  background: 'linear-gradient(90deg, #00c8ff 0%, #0078d7 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '16px',
  cursor: 'pointer',
  marginBottom: '8px',
  fontWeight: 500,
  fontSize: '13px',
  boxShadow: '0 1px 4px #222c3c',
  transition: 'background 0.2s',
  outline: 'none',
};

// ...modern styles are now declared above...
// Sidebar component definition
const Sidebar = () => {
  const { getNodes, getEdges } = useReactFlow();
  const [search, setSearch] = useState('');

  // Function to handle button click and log nodes and edges
  const handleButtonClick = async () => {
    const nodes = getNodes() as FlowNode[];
    const edges = getEdges();

    const minimalNodes: MinimalNode[] = [];
    for (const element of nodes) {
      minimalNodes.push({
        id: element.id,
        label: element.data.label,
        title: element.data.title,
        x: element.position.x,
        y: element.position.y
      })
    }

    const minimalEdge: MinimalEdge[] = [];
    for (const element of edges) {
      minimalEdge.push({
        id: element.id,
        middleLabel: element.data?.middelLabel as string || '',
        source: element.source,
        target: element.target
      })
    }
    const dataObject = {nodes: minimalNodes, edges: minimalEdge}

    console.log(dataObject)
    // Copy to clipboard
    const encodedNodes = encodeURIComponent(JSON.stringify(dataObject));
    try {
      const currentDomain = window.location.origin;
      const currentPath = window.location.pathname;
      console.log(currentPath)
      const clipboardData = `${currentDomain}${currentPath}?data=${encodedNodes}`;
      await navigator.clipboard.writeText(clipboardData);
      alert('Nodes and Edges copied to clipboard!');
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  }

  // Combine all nodes into one array
  const allNodes: ServiceNode[] = [
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

  // Filter nodes by search
  const filterNodes = (nodes: ServiceNode[]) =>
    nodes.filter(node => node.title.toLowerCase().includes(search.toLowerCase()));

  // Group nodes by category
  const filteredNodes = filterNodes(allNodes);
  const nodesByCategory: { [key: string]: ServiceNode[] } = {};
  filteredNodes.forEach(node => {
    if (!nodesByCategory[node.category]) nodesByCategory[node.category] = [];
    nodesByCategory[node.category].push(node);
  });

  return (
    <div style={sidebarStyle}>
      <h1 style={headerStyle}>FlowiTec</h1>
      <div style={searchBarStyle}>
        <FaSearch color="#00c8ff" size={16} />
        <input
          type="text"
          style={searchInputStyle}
          placeholder="Search nodes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <button onClick={handleButtonClick} style={buttonStyle}>
        Share link
      </button>
      <div style={iconGridBoxStyle}>
        {Object.entries(nodesByCategory).map(([category, nodes], catIdx) => (
          <React.Fragment key={category}>
            <div style={categoryLabelStyle}>{category}</div>
            <div style={categoryDividerStyle}></div>
            <div style={iconGridStyle}>
              {nodes.map((node, index) => (
                <div
                  key={index}
                  draggable
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #23272f 60%, #00c8ff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px #00c8ff33',
                    margin: '4px',
                    cursor: 'grab',
                    border: '1px solid #222c3c',
                    transition: 'box-shadow 0.2s, background 0.2s, opacity 0.2s, transform 0.2s',
                    position: 'relative',
                    isolation: 'isolate'
                  }}
                  onDragStart={event => {
                    const nodeWithProps = { ...node, label: node.title };
                    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeWithProps));
                    event.currentTarget.style.opacity = '0.5';
                    event.currentTarget.style.transform = 'scale(1.15)';
                    event.currentTarget.style.boxShadow = '0 4px 16px #00c8ff';
                  }}
                  onDragEnd={event => {
                    event.currentTarget.style.opacity = '1';
                    event.currentTarget.style.transform = 'scale(1)';
                    event.currentTarget.style.boxShadow = '0 1px 4px #00c8ff33';
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 2px 8px #00c8ff';
                    const tooltip = e.currentTarget.querySelector('.sidebar-tooltip') as HTMLElement | null;
                    if (tooltip) {
                      tooltip.style.opacity = '1';
                      tooltip.style.visibility = 'visible';
                      const rect = e.currentTarget.getBoundingClientRect();
                      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                      tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
                      tooltip.style.marginBottom = '0';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 1px 4px #00c8ff33';
                    const tooltip = e.currentTarget.querySelector('.sidebar-tooltip') as HTMLElement | null;
                    if (tooltip) {
                      tooltip.style.opacity = '0';
                      tooltip.style.visibility = 'hidden';
                    }
                  }}
                  title={node.title}
                >
                  <img
                    src={node.iconUrl}
                    alt={node.title}
                    draggable="false"
                    style={{ width: 22, height: 22, borderRadius: '50%' }}
                  />
                  <div className="sidebar-tooltip" style={tooltipStyle}>
                    {node.title} <span style={{ color: '#7fdfff', fontWeight: 400, marginLeft: 6 }}>({node.category})</span>
                    <span style={tooltipArrowStyle}></span>
                  </div>
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

