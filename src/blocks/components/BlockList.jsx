import { useSelector, useDispatch } from "react-redux";
import BlockAdd from "./BlockAdd";
import BlockEditor from "./BlockEditor";
import { removeBlock } from "../blocksSlice";

function BlockList() {
  const dispatch = useDispatch();
  const blocks = useSelector((state) => state.blocks.items);

  return (
    <div className="flex flex-col w-full h-full bg-gray-50 border-l border-gray-300">
      <div className="p-4 border-b border-gray-300 bg-white">
        <h2 className="text-xl font-semibold">📚 Bibliothèque de blocs</h2>
      </div>

      <div className="p-4 overflow-auto flex-1 space-y-6">
        <BlockAdd />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {blocks.map((block) => (
            <BlockEditor
              key={block.id}
              block={block}
              removeBlock={() => dispatch(removeBlock(block.id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlockList;
