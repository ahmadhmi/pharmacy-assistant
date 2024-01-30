import { Gradesheet } from "@/types/gradesheet";
import { Student } from "@/types/student";

interface Props {
  student: Student,
  gradesheets: Gradesheet[],
}

export default function StudentAccordion({ student }: Props) {
  return (
    <div className="collapse collapse-arrow min-w-80 border-2 border-black">
      <input type="checkbox" name="my-accordion-1"></input>
      <div className="collapse-title flex justify-between items-center gap-2">
        <h3 className="text-md font-bold">{`${student.firstName} ${student.lastName}`}</h3>
        <div className="flex flex-row gap-2">
          <div className="badge badge-primary">4</div>
          <div className="badge badge-primary">{`${40}/${44}`}</div>
        </div>
      </div>
      <div className="collapse-content">
        <p>Hello world</p>
      </div>
    </div>
  );
}
