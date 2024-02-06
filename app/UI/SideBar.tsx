import React from "react";

const SideBar = () => {
  const blocks = ["Block A", "Block B", "Block C"];
  return (
    <aside>
      {blocks.map((block) => (
        <button className="btn btn-neutral mb-3 w-full text-lg" key={block}>
          {block}
        </button>
      ))}
      <button className="btn btn-primary mb-3 w-full text-lg">
        Add Block
      </button>
    </aside>
  );
};

export default SideBar;
