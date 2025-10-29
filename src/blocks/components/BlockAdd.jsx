function BlockItem({ block, onClick }) {
  return (
    <div className="block-item" onClick={onClick}>
      {block}
    </div>
  );
}

export default BlockItem;