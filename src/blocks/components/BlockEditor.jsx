function BlockEditor({ block, onChange }) {
  return (
    <div className="block-editor">
      <textarea
        value={block}
        onChange={(e) => onChange(e.target.value)}
        className="block-textarea"
      />
    </div>
  );
}

export default BlockEditor;