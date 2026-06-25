import { Handle, Position } from 'reactflow';
import { useState } from 'react';

const styles = {
  node: (color, selected) => ({
    background: 'var(--bg-surface)',
    border: `1.5px solid ${selected ? color : 'var(--border)'}`,
    borderRadius: 'var(--radius-lg)',
    minWidth: 220,
    boxShadow: selected
      ? `0 0 0 2px ${color}44, var(--shadow-node)`
      : 'var(--shadow-node)',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-sans)',
    overflow: 'visible',
  }),
  header: (color) => ({
    background: `linear-gradient(135deg, ${color}22 0%, ${color}10 100%)`,
    borderBottom: `1px solid var(--border)`,
    padding: '10px 14px',
    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  }),
  icon: (color) => ({
    width: 28,
    height: 28,
    borderRadius: 'var(--radius-sm)',
    background: `${color}22`,
    border: `1px solid ${color}44`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    flexShrink: 0,
  }),
  title: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-primary)',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  badge: (color) => ({
    marginLeft: 'auto',
    fontSize: 9,
    fontWeight: 600,
    color: color,
    background: `${color}20`,
    border: `1px solid ${color}40`,
    padding: '2px 7px',
    borderRadius: 99,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  }),
  body: {
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  handleLabel: {
    position: 'absolute',
    fontSize: 10,
    color: 'var(--text-muted)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  },
  handleLabelLeft: {
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  handleLabelRight: {
    right: 14,
    top: '50%',
    transform: 'translateY(-50%)',
  },
};

// Field components for use in nodes
export const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    {label && (
      <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
        {label}
      </label>
    )}
    {children}
  </div>
);

export const InputField = ({ value, onChange, placeholder, style = {} }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-primary)',
      fontSize: 12,
      padding: '6px 10px',
      outline: 'none',
      width: '100%',
      fontFamily: 'var(--font-sans)',
      transition: 'border-color 0.2s',
      ...style,
    }}
    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
    onBlur={e => e.target.style.borderColor = 'var(--border)'}
  />
);

export const SelectField = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-primary)',
      fontSize: 12,
      padding: '6px 10px',
      outline: 'none',
      width: '100%',
      fontFamily: 'var(--font-sans)',
      cursor: 'pointer',
    }}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export const TextareaField = ({ value, onChange, placeholder, rows = 3, style = {} }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-primary)',
      fontSize: 12,
      padding: '6px 10px',
      outline: 'none',
      width: '100%',
      fontFamily: 'var(--font-mono)',
      resize: 'none',
      lineHeight: 1.6,
      transition: 'border-color 0.2s',
      ...style,
    }}
    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
    onBlur={e => e.target.style.borderColor = 'var(--border)'}
  />
);

/**
 * BaseNode — the reusable node abstraction.
 *
 * Props:
 *  - id: node id
 *  - selected: whether node is selected
 *  - title: node label (string)
 *  - icon: emoji or character for header icon
 *  - color: accent color for this node type (CSS variable ref or hex)
 *  - badge: optional short label shown in header (e.g. "LLM")
 *  - inputs: array of { id, label, position? } for input handles
 *  - outputs: array of { id, label, position? } for output handles
 *  - children: the node body content (fields, etc.)
 *  - width: optional fixed width
 */
export const BaseNode = ({
  id,
  selected,
  title,
  icon,
  color = 'var(--accent)',
  badge,
  inputs = [],
  outputs = [],
  children,
  width,
  style = {},
}) => {
  const [hovered, setHovered] = useState(false);

  // Distribute handles evenly along the node
  const getHandleTop = (index, total) => {
    if (total === 1) return '50%';
    const spacing = 100 / (total + 1);
    return `${spacing * (index + 1)}%`;
  };

  return (
    <div
      style={{ ...styles.node(color, selected || hovered), width: width || 'auto', ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Input handles */}
      {inputs.map((handle, i) => (
        <div key={handle.id}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${handle.id}`}
            style={{ top: getHandleTop(i, inputs.length) }}
          />
          {handle.label && (
            <span style={{
              ...styles.handleLabel,
              ...styles.handleLabelLeft,
              top: getHandleTop(i, inputs.length),
            }}>
              {handle.label}
            </span>
          )}
        </div>
      ))}

      {/* Output handles */}
      {outputs.map((handle, i) => (
        <div key={handle.id}>
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-${handle.id}`}
            style={{ top: getHandleTop(i, outputs.length) }}
          />
          {handle.label && (
            <span style={{
              ...styles.handleLabel,
              ...styles.handleLabelRight,
              top: getHandleTop(i, outputs.length),
            }}>
              {handle.label}
            </span>
          )}
        </div>
      ))}

      {/* Header */}
      <div style={styles.header(color)}>
        <div style={styles.icon(color)}>{icon}</div>
        <span style={styles.title}>{title}</span>
        {badge && <span style={styles.badge(color)}>{badge}</span>}
      </div>

      {/* Body */}
      <div style={styles.body}>{children}</div>
    </div>
  );
};
