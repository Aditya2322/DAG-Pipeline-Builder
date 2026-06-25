import { useState } from 'react';
import { BaseNode, Field, InputField, SelectField } from './BaseNode';
import { useStore } from '../store';

export const InputNode = ({ id, data, selected }) => {
  const updateField = useStore(s => s.updateNodeField);
  const [name, setName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [type, setType] = useState(data?.inputType || 'Text');

  const handleName = (e) => {
    setName(e.target.value);
    updateField(id, 'inputName', e.target.value);
  };
  const handleType = (e) => {
    setType(e.target.value);
    updateField(id, 'inputType', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      selected={selected}
      title="Input"
      icon="⬇️"
      color="var(--green)"
      badge="Source"
      inputs={[]}
      outputs={[{ id: 'value', label: 'value' }]}
    >
      <Field label="Name">
        <InputField value={name} onChange={handleName} placeholder="input_name" />
      </Field>
      <Field label="Type">
        <SelectField
          value={type}
          onChange={handleType}
          options={[
            { value: 'Text', label: 'Text' },
            { value: 'File', label: 'File' },
            { value: 'Image', label: 'Image' },
            { value: 'Number', label: 'Number' },
          ]}
        />
      </Field>
    </BaseNode>
  );
};
