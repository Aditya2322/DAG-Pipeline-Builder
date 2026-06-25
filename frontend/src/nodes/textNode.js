import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const vars = [];
  const seen = new Set();
  let match;
  VAR_REGEX.lastIndex = 0;
  while ((match = VAR_REGEX.exec(text)) !== null) {
    const name = match[1];
    if (!seen.has(name)) {
      seen.add(name);
      vars.push(name);
    }
  }
  return vars;
};

export const TextNode = ({ id, data, selected }) => {
  const updateField = useStore(s => s.updateNodeField);
  const [text, setText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const [size, setSize] = useState({ width: 260, height: 'auto' });

  useEffect(() => {
    const vars = extractVariables(text);
    setVariables(vars);
  }, [text]);

  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize height
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';

      // Auto-resize width based on longest line
      const lines = text.split('\n');
      const longest = lines.reduce((a, b) => (a.length > b.length ? a : b), '');
      const charWidth = 7.5;
      const padding = 80;
      const newWidth = Math.max(260, Math.min(600, longest.length * charWidth + padding));
      setSize(s => ({ ...s, width: newWidth }));
    }
  }, [text]);

  const handleChange = (e) => {
    setText(e.target.value);
    updateField(id, 'text', e.target.value);
  };

  const getHandleTop = (index, total) => {
    if (total === 1) return '50%';
    const spacing = 100 / (total + 1);
    return `${spacing * (index + 1)}%`;
  };

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: `1.5px solid ${selected ? 'var(--yellow)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        width: size.width,
        boxShadow: selected
          ? `0 0 0 2px var(--yellow-dim), var(--shadow-node)`
          : 'var(--shadow-node)',
        transition: 'all 0.2s ease',
        fontFamily: 'var(--font-sans)',
        overflow: 'visible',
        position: 'relative',
      }}
    >
      {/* Variable input handles */}
      {variables.map((varName, i) => (
        <div key={varName}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${varName}`}
            style={{ top: getHandleTop(i, variables.length) }}
          />
          <span style={{
            position: 'absolute',
            left: 14,
            top: getHandleTop(i, variables.length),
            transform: 'translateY(-50%)',
            fontSize: 10,
            color: 'var(--yellow)',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            fontFamily: 'var(--font-mono)',
          }}>
            {varName}
          </span>
        </div>
      ))}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ top: '50%' }}
      />
      <span style={{
        position: 'absolute',
        right: 14,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 10,
        color: 'var(--text-muted)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        text
      </span>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--yellow-dim) 0%, rgba(251,191,36,0.05) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '10px 14px',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 'var(--radius-sm)',
          background: 'var(--yellow-dim)', border: '1px solid rgba(251,191,36,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>✏️</div>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
          Text
        </span>
        {variables.length > 0 && (
          <span style={{
            marginLeft: 'auto', fontSize: 9, fontWeight: 600,
            color: 'var(--yellow)', background: 'var(--yellow-dim)',
            border: '1px solid rgba(251,191,36,0.3)',
            padding: '2px 7px', borderRadius: 99, letterSpacing: '0.05em',
          }}>
            {variables.length} VAR{variables.length > 1 ? 'S' : ''}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px' }}>
        <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.03em', display: 'block', marginBottom: 5 }}>
          Text
        </label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          placeholder="Enter text... use {{variable}} for inputs"
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
            overflow: 'hidden',
            minHeight: 60,
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--yellow)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        {variables.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {variables.map(v => (
              <span key={v} style={{
                fontSize: 10, fontWeight: 600,
                color: 'var(--yellow)', background: 'var(--yellow-dim)',
                border: '1px solid rgba(251,191,36,0.25)',
                padding: '2px 8px', borderRadius: 99,
                fontFamily: 'var(--font-mono)',
              }}>
                {`{{${v}}}`}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
