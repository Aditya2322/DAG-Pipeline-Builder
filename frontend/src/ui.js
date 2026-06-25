import { useRef, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import { useStore } from './store';
import { PipelineToolbar } from './toolbar';
import { SubmitButton } from './submit';
import {
  InputNode, OutputNode, LLMNode, TextNode,
  ApiNode, TransformNode, ConditionalNode, NoteNode, MergeNode,
} from './nodes';

const nodeTypes = {
  customInput: InputNode,
  customOutput: OutputNode,
  llm: LLMNode,
  text: TextNode,
  api: ApiNode,
  transform: TransformNode,
  conditional: ConditionalNode,
  note: NoteNode,
  merge: MergeNode,
};

const NODE_DEFAULTS = {
  customInput:  { inputName: '', inputType: 'Text' },
  customOutput: { outputName: '', outputType: 'Text' },
  llm:          { model: 'gpt-4o' },
  text:         { text: '{{input}}' },
  api:          { url: '', method: 'GET' },
  transform:    { code: 'return input;' },
  conditional:  { condition: 'input === true' },
  note:         { note: '' },
  merge:        { strategy: 'concat' },
};

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, getNodeID } = useStore();

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow');
    if (!type || !reactFlowWrapper.current) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = {
      x: e.clientX - bounds.left - 110,
      y: e.clientY - bounds.top - 50,
    };

    const id = getNodeID(type);
    addNode({
      id,
      type,
      position,
      data: { ...NODE_DEFAULTS[type] },
    });
  }, [getNodeID, addNode]);

  const nodeCount = nodes.length;
  const edgeCount = edges.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      {/* Top bar */}
      <div style={{
        height: 52,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
            Pipeline Editor
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: `${nodeCount} node${nodeCount !== 1 ? 's' : ''}`, color: 'var(--accent)' },
              { label: `${edgeCount} edge${edgeCount !== 1 ? 's' : ''}`, color: 'var(--green)' },
            ].map(({ label, color }) => (
              <span key={label} style={{
                fontSize: 11, fontWeight: 500,
                color, background: `${color}18`,
                border: `1px solid ${color}33`,
                padding: '2px 10px', borderRadius: 99,
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Drag nodes from the sidebar · Connect handles · Submit to analyze
          </span>
          <SubmitButton />
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <PipelineToolbar />

        {/* Canvas */}
        <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[12, 12]}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            deleteKeyCode={['Backspace', 'Delete']}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const colorMap = {
                  customInput: '#4ade80', customOutput: '#f87171',
                  llm: '#6c63ff', text: '#fbbf24',
                  api: '#60a5fa', transform: '#2dd4bf',
                  conditional: '#c084fc', note: '#fb923c', merge: '#f472b6',
                };
                return colorMap[node.type] || '#6c63ff';
              }}
              maskColor="rgba(13,15,20,0.7)"
            />
          </ReactFlow>

          {/* Empty state */}
          {nodes.length === 0 && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none', gap: 12,
            }}>
              <div style={{ fontSize: 48 }}>⚡</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}>
                Start building your pipeline
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 300 }}>
                Drag nodes from the left sidebar onto the canvas, then connect them by dragging between handles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
