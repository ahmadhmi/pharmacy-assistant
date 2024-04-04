"use client";
import { LabData } from "@/types/LabData";
import React, { Suspense } from "react";
import MyButton from "@/app/UI/componenttest";
import axios, { all } from "axios";
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
import Skeleton from "react-loading-skeleton";
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 35,
    paddingHorizontal: 35,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  title: {
    fontSize: 15,
    textAlign: "center",
    marginVertical: 5,
  },
  text: {
    margin: 2,
    fontSize: 8,
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
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchedLabData, setSearchedLabData] = useState<Record<string, Gradesheet[]> | null>(null);
  async function fetchGradingSheets() {
    try {
      const data = (setIsLoading(true),
      await axios.get(
        //`/api/blocks/65cbe1af929966312830eea0/65e6c4517fdb6a053a93de8a/grading`
        `/api/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading`
      )).data;
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
    setIsLoading(false);
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
          {checkBoxValue.map((itemId, index) => {
            const sheet = (searchedLabData
              ? Object.values(searchedLabData).flat()
              : allSheets
            ).find((sheet) => sheet._id === itemId);
            return (
              <View key={index} style={{ minHeight: 500, width: 360, gap: 5 }}>
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
                <View
                  style={{
                    marginTop: "10px",
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Overall</Text>
                  <Text>{sheet?.pass?.toString()}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text>Comments: {sheet?.comment}</Text>
                </View>
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
    console.log(checkBoxValue);
    console.log(allSheets);
  };
  const handleSelectAll = () => {
    const sheetsToSelect = searchedLabData ? Object.values(searchedLabData).flat() : allSheets;
    setCheckBoxValue(sheetsToSelect.map((sheet) => sheet._id));
    console.log(checkBoxValue);
  };
  const handleUnSelectAll = () => {
    setIsChecked(true);
    setCheckBoxValue([]);
    console.log(checkBoxValue);
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleShowAll = () => {
    setSearch("");
    setSearchedLabData(null);
  }
  const handleSearch = () => {
    if(!search.trim()) {
      setSearchedLabData(null);
    } else {
      const searchResult = Object.keys(labData).reduce((result: Record<string, Gradesheet[]>, key) => {
        const searchedGradesheets = labData[key].filter(gradeSheets =>
          gradeSheets.studentName?.includes(search));
        if (searchedGradesheets.length) result[key] = searchedGradesheets;
        return result;
      }, {});
      setSearchedLabData(searchResult);
    }
  };

  return (
    <section className="display-flex justify-center h-screen w-100% px-8 py-10">
      <div className="flex justify-between items-center py-2">
        <h1 className="text-center text-3xl">Lab Page</h1>
        <div className="flex gap-2">
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow bg-transparent" placeholder="Enter student name" value={search} onChange={handleInput} onKeyDown={handleEnter} />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
        </label>
          <button onClick={handleShowAll} className="btn bnt-neutral" title="search" >Show all</button>
          <button
            className="btn bnt-neutral"
            title="select All"
            onClick={handleSelectAll}
          >
            Select all
          </button>
          <button
            className="btn bnt-neutral"
            title="Unselect All"
            onClick={handleUnSelectAll}
          >
            Unselect all
          </button>
          <Link className="btn bnt-neutral" href={`${params.labId}/criteria`}>
            Edit Criteria
          </Link>
        </div>
      </div>
      <div className="border-y overflow-y-auto" style={{ height: "80%" }}>
        {isLoading ? (
          <Skeleton height={100}></Skeleton>
        ) : searchedLabData || Object.keys(labData).length > 0 ? (
          Object.keys(searchedLabData || labData).map((key) => (
            <div className="collapse collapse-arrow bg-base-200 my-3" key={key}>
              <input type="checkbox" name="my-accordion-2" placeholder="1" />
              <div className="collapse-title text-xl font-medium">
                {(searchedLabData || labData)[key][0]?.studentName}
              </div>
              <div className="collapse-content bg-primary">
                {(searchedLabData || labData)[key].map((gradesheet, index) => (
                  <div
                    className="flex flex-row items-center justify-between text-black my-2 "
                    key={index}
                  >
                    <input
                      title="checkbox"
                      type="checkbox"
                      name={gradesheet._id}
                      value={gradesheet._id}
                      checked={
                        checkBoxValue.find((id) => id === gradesheet._id)
                          ? true
                          : false
                      }
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
          <button
            className={`btn bnt-neutral ${
              checkBoxValue.length === 0 ? "hidden" : "display"
            }`}
            title="Export"
            disabled={checkBoxValue.length < 1}
          >
            Export
          </button>
        </PDFDownloadLink>

        <Link
          href={`/home/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading/`}
        >
          <button title="Grading" className="btn btn-neutral">
            Grading
          </button>
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
