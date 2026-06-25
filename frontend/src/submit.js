import { useStore } from './store';
import { useState } from 'react';

export const SubmitButton = () => {
  const nodes = useStore(s => s.nodes);
  const edges = useStore(s => s.edges);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      alert('⚠️  Your pipeline is empty. Add some nodes first!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://dag-pipeline-builder-backend.onrender.com/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      const { num_nodes, num_edges, is_dag } = data;

      const dagStatus = is_dag
        ? '✅ Yes — no cycles detected'
        : '❌ No — cycle detected!';

      alert(
        `📊 Pipeline Analysis\n` +
        `${'─'.repeat(30)}\n` +
        `🔵 Nodes:     ${num_nodes}\n` +
        `🔗 Edges:     ${num_edges}\n` +
        `🔄 Is DAG:    ${dagStatus}`
      );
    } catch (err) {
      alert(`❌ Could not reach backend.\n\nMake sure the FastAPI server is running:\nuvicorn main:app --reload\n\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      style={{
        padding: '10px 24px',
        borderRadius: 'var(--radius-md)',
        background: loading ? 'var(--bg-elevated)' : 'var(--accent)',
        color: loading ? 'var(--text-muted)' : '#fff',
        border: 'none',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        cursor: loading ? 'not-allowed' : 'pointer',
        letterSpacing: '0.02em',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: loading ? 'none' : '0 2px 12px var(--accent-glow)',
      }}
      onMouseEnter={e => {
        if (!loading) {
          e.currentTarget.style.background = 'var(--accent-light)';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 20px var(--accent-glow)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = loading ? 'var(--bg-elevated)' : 'var(--accent)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = loading ? 'none' : '0 2px 12px var(--accent-glow)';
      }}
    >
      {loading ? (
        <><span style={{ fontSize: 16 }}>⏳</span> Analyzing...</>
      ) : (
        <><span style={{ fontSize: 16 }}>🚀</span> Submit Pipeline</>
      )}
    </button>
  );
};
