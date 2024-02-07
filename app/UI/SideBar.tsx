"use client";

import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useBlocksContext } from "../_utils/blocks-context";
import { Block } from "@/interfaces/block";

interface Props {
  children: React.ReactNode;
}

const SideBar = ({ children }: Props) => {
  const blocks: string[] = [
    "Block 1", "Block 2"
  ];
  const {selectedBlock, setSelectedBlock}:{selectedBlock:Block, setSelectedBlock:Function } = useBlocksContext();
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden m-3 text-xl
              "
        >
          {selectedBlock.name}
          <IoIosArrowDown />
        </label>
        <main className="p-3 bg-white min-h-screen">{children}</main>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {blocks.length === 0 ? (
            <p>There is no block for this account!</p>
          ) : (
            <div>
              {blocks.map((block) => (
                <button
                  className="btn btn-neutral mb-3 w-full text-lg"
                  key={block}
                  onClick={() => setSelectedBlock(block)}
                >
                  {block}
                </button>
              ))}
              <button className="btn btn-primary mb-3 w-full text-lg">
                Add Block
              </button>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
