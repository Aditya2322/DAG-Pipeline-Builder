export const DraggableNode = ({ type, label, icon, color }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        border: `1px solid var(--border)`,
        background: 'var(--bg-surface)',
        cursor: 'grab',
        userSelect: 'none',
        transition: 'all 0.15s ease',
        minWidth: 120,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--bg-elevated)';
        e.currentTarget.style.borderColor = color || 'var(--accent)';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.3)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--bg-surface)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        width: 24, height: 24,
        borderRadius: 'var(--radius-sm)',
        background: color ? `${color}22` : 'var(--accent-dim)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  );
};
