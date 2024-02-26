"use client";

import { useState } from "react";

export default function Grading() {

    const formatDate = (date:Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [id, setId] = useState("");
    const [date, setDate] = useState(formatDate(new Date()));
    const [rx, setRx] = useState(""); 

    return (
        <section className="flex-col">
            <form className="grid grid-cols-1 grid-rows-2 gap-4">
                <div className="flex flex-row gap-4">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Student ID</span>
                        </div>
                        <input
                            type="text"
                            className="input-md rounded-md"
                            placeholder="000888999"
                            value={id}
                            onChange={(e) => {setId(e.currentTarget.value)}}
                        ></input>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Date</span>
                        </div>
                        <input
                            type="date"
                            className="input-md rounded-md"
                            value={date}
                            onChange={(e) => setDate(e.currentTarget.value)}
                        ></input>
                    </label>
                </div>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Rx Number</span>
                    </div>
                    <input type="text" placeholder="111222333" className="input-md rounded-md" value={rx}></input>
                </label>
                <button className="btn">Grade Student</button>
            </form>
        </section>
    );
}
