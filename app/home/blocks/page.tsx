"use client";

import BlockCard from "@/app/UI/Blocks/BlockCard";
import { useBlocksContext } from "@/app/_utils/blocks-context";
import { Block } from "@/interfaces/block";

export default function Blocks() {
  const { blocks, setSelectedBlock } = useBlocksContext();
  console.log(blocks);
  return (
    <div className="bg-slate-600">
      {blocks.map((block: Block) => (
        <BlockCard
          key={block.name}
          block={block}
          handleEditBlock={setSelectedBlock}
          handleViewBlock={setSelectedBlock}
        />
      ))}
    </div>
  );
}
