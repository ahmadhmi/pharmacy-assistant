import { Gradesheet } from "@/interfaces/gradesheet";

interface Props{
    studentID:string,
    gradesheets:Gradesheet[],
}

export default function AccordionTab({studentID, gradesheets}:Props){
    <div className="collapse collapse-arrow min-w-80 border-2 border-black">
    <input type="checkbox" name="my-accordion-1"></input>
    <div className="collapse-title flex justify-between items-center gap-2">
      <h3 className="text-md font-bold">{`Student ID: ${studentID}`}</h3>
      <div className="flex flex-row gap-2">
        <div className="badge badge-primary">4</div>
        <div className="badge badge-primary">{`${40}/${44}`}</div>
      </div>
    </div>
    <div className="collapse-content">
      <p>Hello world</p>
    </div>
  </div>
}