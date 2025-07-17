import React, { memo } from 'react';

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';


export type ServiceCategory = 'Compute' | 'Integration' | 'Storage' | 'Network' | 'Data Formats' | 'Block' | 'Trigger' | 'Action' | 'Logic' | 'Resource';


export type ServiceNode = {
  title: string
  category: ServiceCategory
  iconUrl: string
  appRoles?: string[]
  subline?: string,
  label?: string,
  editing?: boolean
}

export default memo(({ data }: NodeProps<Node<ServiceNode>>) => {
  switch (data.category) {
    case 'Data Formats':
      return (
        <div style={dataFormatsNodeStyle}>
          <Handle type="target" position={Position.Top} style={handleStyle} />
          {data.iconUrl && <img src={data.iconUrl} alt="Icon" style={dataFormatsIconStyle} />}
          <Handle type="source" position={Position.Bottom} style={handleStyle} />
        </div>
      );

    default:
      return (
        <div style={nodeStyle}>
          {data.iconUrl && <img src={data.iconUrl} alt="Icon" style={iconStyle} />}
          <div style={titleStyle}>{data.title}</div>
          <div style={labelStyle}>{data.label}</div>
          {data.subline && <div style={sublineStyle}>{data.subline}</div>}

          {data.appRoles && (
            <div>
              <label htmlFor="app_role">Act as:</label>
              <select name="app_role" id="app_role">
                {data.appRoles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Handle type="target" position={Position.Top} style={handleStyle} />
          <Handle type="source" position={Position.Bottom} style={handleStyle} />
        </div>
      );
  }
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

const dataFormatsNodeStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #00c8ff',
  borderRadius: '50%',
  width: '75px',
  height: '75px',
  boxShadow: '0 0 10px rgba(0, 200, 255, 0.3)',
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-15px', // Position above the node
  right: '-15px', // Position to the right of the node
  width: '40px',
  height: '40px',
  objectFit: 'contain'
};

const dataFormatsIconStyle: React.CSSProperties = {
  width: '50%',
  height: '50%',
  objectFit: 'contain',
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
