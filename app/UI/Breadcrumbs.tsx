import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Block } from "@/interfaces/block";
import axios from "axios";
import { RxArrowRight } from "react-icons/rx";
import { Gradesheet } from "@/interfaces/gradesheet";
import { useRouter } from "next/navigation";

const Breadcrumbs = () => {
  const [blocks, setBlocks] = useState<Block[]>();
  const [gradeSheets, setGradeSheets] = useState<Gradesheet[]>();
  const fetchBlocks = async function getBlocks() {
    try {
      const response = await axios.get("/api/blocks");
      const blocks: Block[] = response.data;
      console.log(response.data);
      setBlocks(blocks);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((path) => path !== "");

  const breadcrumbLinks = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    let tempBlock = null;
    let tempWeek = null;
    let tempLab = null;
    let tempGrading = null;
    let segmentName = "";
    if (blocks) {
      tempBlock = blocks.find((block) => block._id === segment)?.name || null;
      for (let block of blocks!) {
        if (block.weeks) {
          for (let week of block.weeks) {
            if (week._id === segment) {
              tempWeek = week.name;
              break;
            } else if (week.labs) {
              for (let lab of week.labs) {
                if (lab._id === segment) {
                  tempLab = lab.name;
                  break;
                }
              }
            }
          }
        }
      }
    }
    if (tempBlock !== null) {
      segmentName = tempBlock.toUpperCase();
    } else if (tempWeek !== null) {
      segmentName = tempWeek.toUpperCase();
    } else if (tempLab !== null) {
      segmentName = tempLab!.toUpperCase();
    } else {
      segmentName = segment.replace(/-/g, " ").toUpperCase();
    }
    const isLastSegment = index === pathSegments.length - 1;
    const isGradeSheet = index === 6;
    const beforeGrading = pathSegments.length === 7 && index === 5;

    if (
      isGradeSheet ||
      segmentName === "BLOCKS" ||
      (index === 3 && segmentName !== "EDITBLOCK")
    )
      return;

    return (
      <li
        className={`text-xs flex  rounded-md font-bold  ${
          isLastSegment || beforeGrading ? " bg-primary  text-black" : ""
        }`}
        key={href}
      >
        <Link href={href}>
          {(isLastSegment || beforeGrading) && (
            <RxArrowRight size={20} color="black" />
          )}
          {segmentName}
        </Link>

        {/* {index < pathSegments.length - 1 ? " > " : ""} */}
      </li>
    );
  });

  return (
    <nav className="gap-2">
      <h2 className="text-xl text-primary font-bold min-w-56 border-b-2 border-primary mb-4">
        You Are Here
      </h2>
      <ul className="space-y-0">{breadcrumbLinks}</ul>
      {/* {breadcrumbLinks.length > 0 ? " > " : ""} */}
    </nav>
  );
};

export default Breadcrumbs;
