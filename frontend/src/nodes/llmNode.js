import { useState } from 'react';
import { BaseNode, Field, SelectField } from './BaseNode';
import { useStore } from '../store';

export const LLMNode = ({ id, data, selected }) => {
  const updateField = useStore(s => s.updateNodeField);
  const [model, setModel] = useState(data?.model || 'gpt-4o');

  const handleModel = (e) => {
    setModel(e.target.value);
    updateField(id, 'model', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      selected={selected}
      title="LLM"
      icon="🧠"
      color="var(--accent)"
      badge="AI"
      inputs={[
        { id: 'system', label: 'system' },
        { id: 'prompt', label: 'prompt' },
      ]}
      outputs={[{ id: 'response', label: 'response' }]}
    >
      <Field label="Model">
        <SelectField
          value={model}
          onChange={handleModel}
          options={[
            { value: 'gpt-4o', label: 'GPT-4o' },
            { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
            { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
            { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
            { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
            { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
          ]}
        />
      </Field>
      <div style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-sm)',
        padding: '6px 10px',
        lineHeight: 1.5,
      }}>
        Connect a <strong style={{ color: 'var(--text-secondary)' }}>system prompt</strong> and <strong style={{ color: 'var(--text-secondary)' }}>user prompt</strong> to generate a response.
      </div>
    </BaseNode>
  );
};
