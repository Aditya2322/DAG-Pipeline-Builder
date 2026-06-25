import { DraggableNode } from './draggableNode';

const NODE_GROUPS = [
  {
    label: 'Core',
    nodes: [
      { type: 'customInput', label: 'Input', icon: '⬇️', color: 'var(--green)' },
      { type: 'customOutput', label: 'Output', icon: '⬆️', color: 'var(--red)' },
      { type: 'llm', label: 'LLM', icon: '🧠', color: 'var(--accent)' },
      { type: 'text', label: 'Text', icon: '✏️', color: 'var(--yellow)' },
    ],
  },
  {
    label: 'Logic',
    nodes: [
      { type: 'conditional', label: 'Conditional', icon: '🔀', color: 'var(--purple)' },
      { type: 'transform', label: 'Transform', icon: '⚙️', color: 'var(--teal)' },
      { type: 'merge', label: 'Merge', icon: '🔗', color: 'var(--pink)' },
    ],
  },
  {
    label: 'Utilities',
    nodes: [
      { type: 'api', label: 'API Request', icon: '🌐', color: 'var(--blue)' },
      { type: 'note', label: 'Note', icon: '📝', color: 'var(--orange)' },
    ],
  },
];

export const PipelineToolbar = () => {
  return (
    <div style={{
      width: 200,
      height: '100%',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 12px',
      gap: 20,
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '4px 0 8px', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          fontSize: 15, fontWeight: 700, color: 'var(--text-primary)',
          letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-dim)', border: '1px solid var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>⚡</div>
          VectorShift
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
          Pipeline Builder
        </p>
      </div>

      {/* Node groups */}
      {NODE_GROUPS.map(group => (
        <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{
            fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2,
          }}>
            {group.label}
          </p>
          {group.nodes.map(node => (
            <DraggableNode key={node.type} {...node} />
          ))}
        </div>
      ))}
    </div>
  );
};
