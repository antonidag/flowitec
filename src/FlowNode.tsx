import React, { memo, type ReactNode } from 'react';
 
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
 
export type TurboNodeData = {
  title: string;
  subline?: string;
  label: string;
  iconUrl?: string; // Optional property for the icon URL
};
 
export default memo(({ data }: NodeProps<Node<TurboNodeData>>) => {
  return (
    <div style={nodeStyle}>
      {data.iconUrl && <img src={data.iconUrl} alt="Icon" style={iconStyle} />}
      <div style={titleStyle}>{data.title}</div>
      {data.subline && <div style={sublineStyle}>{data.subline}</div>}
      <div style={labelStyle}>{data.label}</div>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
});

const nodeStyle: React.CSSProperties = {
  position: 'relative',
  background: 'linear-gradient(135deg, #1f1f1f, #3f3f3f)',
  border: '2px solid #00c8ff',
  borderRadius: '12px',
  padding: '10px',
  color: '#ffffff',
  fontFamily: 'Arial, sans-serif',
  fontSize: '12px',
  boxShadow: '0 0 15px rgba(0, 200, 255, 0.5)',
  textAlign: 'center',
  width: '150px',
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-15px', // Position above the node
  right: '-15px', // Position to the right of the node
  width: '30px',
  height: '30px',
  objectFit: 'contain'
};

const titleStyle: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: '16px',
  marginBottom: '5px',
};

const sublineStyle: React.CSSProperties = {
  fontStyle: 'italic',
  fontSize: '12px',
  marginBottom: '8px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  marginTop: '10px',
};

const handleStyle: React.CSSProperties = {
  background: '#00c8ff',
  border: 'none',
  width: '10px',
  height: '10px',
};
