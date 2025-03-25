"use client";
import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { PathContext } from "@/app/page";
export default function Content() {
    const { path, setPath } = useContext(PathContext);
    const [data, setData] = useState<string[]>([]);
    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                `http://localhost:8080/api/hdfs/list?hdfsDir=${path}`
            );
            const json = await response.json();
            setData(json);
        }
        fetchData();
    }, [path]);
    return (
        <div className="flex flex-col p-2">
            {data.map((item: string) => {
                return (() => {
                    if (item.includes(".")) {
                        return (
                            <div key={item} className="text-xl font-bold">
                                {item}
                            </div>
                        );
                    } else {
                        return (
                            <div
                                key={item}
                                className="text-xl font-bold"
                                onDoubleClick={() => setPath(`${path}/${item}`)}
                            >
                                {item}
                            </div>
                        );
                    }
                })();
            })}
        </div>
    );
}
