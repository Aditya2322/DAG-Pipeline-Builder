import { useState } from 'react';
import { BaseNode, Field, InputField, SelectField, TextareaField } from './BaseNode';
import { useStore } from '../store';

/* ── 1. API Request Node ─────────────────────────────────────── */
export const ApiNode = ({ id, data, selected }) => {
  const updateField = useStore(s => s.updateNodeField);
  const [url, setUrl] = useState(data?.url || '');
  const [method, setMethod] = useState(data?.method || 'GET');

  return (
    <BaseNode
      id={id} selected={selected}
      title="API Request" icon="🌐" color="var(--blue)" badge="HTTP"
      inputs={[{ id: 'body', label: 'body' }, { id: 'headers', label: 'headers' }]}
      outputs={[{ id: 'response', label: 'response' }, { id: 'status', label: 'status' }]}
    >
      <Field label="Method">
        <SelectField
          value={method} onChange={e => { setMethod(e.target.value); updateField(id, 'method', e.target.value); }}
          options={[
            { value: 'GET', label: 'GET' }, { value: 'POST', label: 'POST' },
            { value: 'PUT', label: 'PUT' }, { value: 'DELETE', label: 'DELETE' },
          ]}
        />
      </Field>
      <Field label="URL">
        <InputField value={url} onChange={e => { setUrl(e.target.value); updateField(id, 'url', e.target.value); }} placeholder="https://api.example.com/endpoint" />
      </Field>
    </BaseNode>
  );
};

/* ── 2. Transform / Code Node ────────────────────────────────── */
export const TransformNode = ({ id, data, selected }) => {
  const updateField = useStore(s => s.updateNodeField);
  const [code, setCode] = useState(data?.code || 'return input;');

  return (
    <BaseNode
      id={id} selected={selected}
      title="Transform" icon="⚙️" color="var(--teal)" badge="JS"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'output', label: 'output' }]}
      width={280}
    >
      <Field label="Code (receives `input`)">
        <TextareaField
          value={code}
          onChange={e => { setCode(e.target.value); updateField(id, 'code', e.target.value); }}
          placeholder="return input.toUpperCase();"
          rows={4}
        />
      </Field>
    </BaseNode>
  );
};

/* ── 3. Conditional / Router Node ───────────────────────────── */
export const ConditionalNode = ({ id, data, selected }) => {
  const updateField = useStore(s => s.updateNodeField);
  const [condition, setCondition] = useState(data?.condition || 'input === true');

  return (
    <BaseNode
      id={id} selected={selected}
      title="Conditional" icon="🔀" color="var(--purple)" badge="Router"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'true', label: 'true' }, { id: 'false', label: 'false' }]}
      width={260}
    >
      <Field label="Condition">
        <InputField
          value={condition}
          onChange={e => { setCondition(e.target.value); updateField(id, 'condition', e.target.value); }}
          placeholder="input.length > 0"
        />
      </Field>
      <div style={{ display: 'flex', gap: 6 }}>
        {['true ✓', 'false ✗'].map((label, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center', fontSize: 10, fontWeight: 600,
            padding: '4px 0', borderRadius: 'var(--radius-sm)',
            background: i === 0 ? 'var(--green-dim)' : 'var(--red-dim)',
            color: i === 0 ? 'var(--green)' : 'var(--red)',
            border: `1px solid ${i === 0 ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
          }}>
            {label}
          </div>
        ))}
      </div>
    </BaseNode>
  );
};

/* ── 4. Note / Annotation Node ──────────────────────────────── */
export const NoteNode = ({ id, data, selected }) => {
  const updateField = useStore(s => s.updateNodeField);
  const [note, setNote] = useState(data?.note || 'Add your notes here...');

  return (
    <BaseNode
      id={id} selected={selected}
      title="Note" icon="📝" color="var(--orange)" badge="Docs"
      inputs={[]} outputs={[]}
      width={220}
    >
      <TextareaField
        value={note}
        onChange={e => { setNote(e.target.value); updateField(id, 'note', e.target.value); }}
        placeholder="Write a note..."
        rows={3}
      />
    </BaseNode>
  );
};

/* ── 5. Data Merge Node ─────────────────────────────────────── */
export const MergeNode = ({ id, data, selected }) => {
  const updateField = useStore(s => s.updateNodeField);
  const [strategy, setStrategy] = useState(data?.strategy || 'concat');

  return (
    <BaseNode
      id={id} selected={selected}
      title="Merge" icon="🔗" color="var(--pink)" badge="Combine"
      inputs={[
        { id: 'input1', label: 'input 1' },
        { id: 'input2', label: 'input 2' },
        { id: 'input3', label: 'input 3' },
      ]}
      outputs={[{ id: 'merged', label: 'merged' }]}
    >
      <Field label="Strategy">
        <SelectField
          value={strategy}
          onChange={e => { setStrategy(e.target.value); updateField(id, 'strategy', e.target.value); }}
          options={[
            { value: 'concat', label: 'Concatenate' },
            { value: 'join', label: 'Join with separator' },
            { value: 'array', label: 'Array' },
            { value: 'object', label: 'Merge objects' },
          ]}
        />
      </Field>
    </BaseNode>
  );
};
