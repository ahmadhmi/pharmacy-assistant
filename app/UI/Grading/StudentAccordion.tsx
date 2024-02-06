import { Lab } from "@/interfaces/Lab";
import AccordionTab from "./AccordionTab";
import { Gradesheet } from "@/interfaces/gradesheet";
import { group } from "console";

interface Props {
  studentLab: Lab,
}

 

export default function StudentAccordion({studentLab} : Props) {

  // reduce student lab gradesheets to get gradesheets in arrays, grouped by student ID

  const gradesheetsByStudents: Record<string, Gradesheet[]> = studentLab.gradesheets.reduce(
    (groupedGradesheets:Record<string, Gradesheet[]>, gradesheet) => {
      const studentID = gradesheet.studentID;
  
      if (groupedGradesheets[studentID] == null) groupedGradesheets[studentID] = [];
  
      groupedGradesheets[studentID].push(gradesheet);
  
      return groupedGradesheets;
    },
    {}
  );


  // for every group, it should have an accordion tab, the group should be passed into the accordion tab to create the table
    return(
      <p>Hello</p>
    )
}
