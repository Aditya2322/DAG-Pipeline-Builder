import { useState } from 'react';
import { BaseNode, Field, InputField, SelectField } from './BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data, selected }) => {
  const updateField = useStore(s => s.updateNodeField);
  const [name, setName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [type, setType] = useState(data?.outputType || 'Text');

  const handleName = (e) => {
    setName(e.target.value);
    updateField(id, 'outputName', e.target.value);
  };
  const handleType = (e) => {
    setType(e.target.value);
    updateField(id, 'outputType', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      selected={selected}
      title="Output"
      icon="⬆️"
      color="var(--red)"
      badge="Sink"
      inputs={[{ id: 'value', label: 'value' }]}
      outputs={[]}
    >
      <Field label="Name">
        <InputField value={name} onChange={handleName} placeholder="output_name" />
      </Field>
      <Field label="Type">
        <SelectField
          value={type}
          onChange={handleType}
          options={[
            { value: 'Text', label: 'Text' },
            { value: 'File', label: 'File' },
            { value: 'Image', label: 'Image' },
          ]}
        />
      </Field>
    </BaseNode>
  );
};
