"use client";
import { LabData } from "@/types/LabData";
import React, { Suspense } from "react";
import MyButton from "@/app/UI/componenttest";
import axios from "axios";
import { useEffect, useState } from "react";
import { group } from "console";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Page,
  Text,
  Document,
  StyleSheet,
  PDFDownloadLink,
  View,
} from "@react-pdf/renderer";
import { Gradesheet } from "@/interfaces/gradesheet";
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 5,
  },
  text: {
    margin: 8,
    fontSize: 10,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "black",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

interface Props {
  params: {
    blockId: string;
    weekId: string;
    labId: string;
  };
}

export default function LabPage({ params }: Props) {
  const [gradeSheets, setGradeSheets] = useState([]);
  const { data: session, status } = useSession();
  const [labData, setLabData] = useState<Record<string, Gradesheet[]>>({});
  const [isChecked, setIsChecked] = useState(false);
  const [checkBoxValue, setCheckBoxValue]: [string[], Function] = useState([]);
  const [allSheets, setAllSheets]: [Gradesheet[], Function] = useState([]);
   const [error, setError] = useState("");
   const [message, setMessage] = useState(""); 
  async function fetchGradingSheets() {
    try {
      const data = (
        await axios.get(
          //`/api/blocks/65cbe1af929966312830eea0/65e6c4517fdb6a053a93de8a/grading`
          `/api/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading`
        )
      ).data;
      if (data) {
        const result = data.reduce(
          (
            groupedGradeSheets: Record<string, Gradesheet[]>,
            gradeSheet: Gradesheet
          ) => {
            const studentID = gradeSheet.studentID;
            if (groupedGradeSheets[studentID] == null)
              groupedGradeSheets[studentID] = [];
            groupedGradeSheets[studentID].push(gradeSheet);
            return groupedGradeSheets;
          },
          {}
        );
        setLabData(result);
        setAllSheets(data);
      }
    } catch (error) {
      setError("Something went wrong while loading");
      setTimeout(() => setError(""), 4000);
    }
    // const data =
      
    //   (
    //     await axios.get(
    //       //`/api/blocks/65cbe1af929966312830eea0/65e6c4517fdb6a053a93de8a/grading`
    //       `/api/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading`
    //     )
    //   ).data;
    // if (data) {
    //   const result = data.reduce(
    //     (
    //       groupedGradeSheets: Record<string, Gradesheet[]>,
    //       gradeSheet: Gradesheet
    //     ) => {
    //       const studentID = gradeSheet.studentID;
    //       if (groupedGradeSheets[studentID] == null)
    //         groupedGradeSheets[studentID] = [];
    //       groupedGradeSheets[studentID].push(gradeSheet);
    //       return groupedGradeSheets;
    //     },
    //     {}
    //   );
    //   setLabData(result);
    //   setAllSheets(data);
    // }
  }

  useEffect(() => {
    fetchGradingSheets();
  }, []);

  const PDFFile = () => {
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.body}>
          {checkBoxValue.map((items, index) => {
            const sheet: Gradesheet | undefined = allSheets.find(
              (sheet) => sheet._id === items
            );
            return (
              <View key={index} style={{ height: 500, width: 380 }}>
                <Text style={styles.title}>
                  {sheet ? sheet.studentName : "Not found"}{" "}
                </Text>
                <Text style={styles.title}>
                  {sheet ? sheet.rx : "Not found"}
                </Text>
                {sheet
                  ? sheet.criteria?.map((items, index) => {
                      return (
                        <View key={index} style={{ flexDirection: "column" }}>
                          <View
                            style={{
                              border: "1px",
                              flexDirection: "row",
                              display: "flex",

                              justifyContent: "space-between",
                            }}
                          >
                            <Text key={index} style={styles.text}>
                              {items.name}
                            </Text>
                            <Text key={index} style={styles.text}>
                              {items.pass.toString()}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  : "Not found"}
              </View>
            );
          })}
        </Page>
      </Document>
    );
  };

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
    setIsChecked(e.target.checked);
    if (e.target.checked === false) {
      setCheckBoxValue((checkValue: string[]) =>
        checkValue.filter((checkValue) => checkValue !== e.target.name)
      );
    } else
      setCheckBoxValue((checkValue: string[]) => [
        ...checkValue,
        e.target.name,
      ]);

    console.log(allSheets);
  };

  return (
    <section className="display-flex justify-center h-screen w-100% px-8 py-10">
      <div className="flex justify-between items-center py-2">
        <h1 className="text-center text-3xl">Lab Page</h1>
        <div className="flex gap-2">
          <Link className="btn bnt-neutral" href={`${params.labId}/criteria`}>
            Edit Criteria
          </Link>
        </div>
      </div>
      <div className="border-y overflow-y-auto" style={{ height: "80%" }}>
        {Object.keys(labData).length > 0 ? (
          Object.keys(labData).map((key) => (
            <div className="collapse collapse-arrow bg-base-200 my-3" key={key}>
              <input type="checkbox" name="my-accordion-2" placeholder="1" />
              <div className="collapse-title text-xl font-medium">
                {labData[key][0]?.studentName}
              </div>
              <div className="collapse-content bg-primary">
                {labData[key].map((gradesheet, index) => (
                  <div
                    className="flex flex-row items-center justify-between text-black my-2 "
                    key={index}
                  >
                    <input
                      title="checkbox"
                      type="checkbox"
                      name={gradesheet._id}
                      value={gradesheet._id}
                      defaultChecked={isChecked}
                      onChange={handleChecked}
                      className=" checkbox border-black"
                    />
                    <p className="font-bold">{gradesheet.rx}</p>
                    <div>
                      <Link
                        href={`/home/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading/${gradesheet._id}`}
                      >
                        <button className="btn btn-sm">Edit</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div>There is no student, please add student first!</div>
        )}
      </div>{" "}
      <div className=" flex justify-center w-100% mt-4 gap-3">
        <PDFDownloadLink document={<PDFFile />}>
          {" "}
          <MyButton text="Export" />
        </PDFDownloadLink>

        <Link
          href={`/home/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading/`}
        >
          <MyButton text="Grading" />
        </Link>
      </div>
      <div
        onClick={() => setMessage("")}
        className={`toast ${message === "" ? "hidden" : ""}`}
      >
        <div className="alert alert-info cursor-pointer text-white hover:alert-warning transition-colors duration-100 ease-in-out">
          {message}
        </div>
      </div>
      <div
        onClick={() => setError("")}
        className={`toast ${error === "" ? "hidden" : ""}`}
      >
        <div className="alert alert-error cursor-pointer text-white hover:alert-warning transition-colors duration-100 ease-in-out">
          {error}
        </div>
      </div>
    </section>
  );
}
