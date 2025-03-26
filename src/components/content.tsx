"use client";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Folder from "./folder";
import File from "./file";
export default function Content({
    path,
    setPath,
    isInput,
    setIsInput,
    setPre,
    cur,
    setCur,
}: {
    path: string;
    setPath: (path: string) => void;
    isInput: boolean;
    setIsInput: (isInput: boolean) => void;
    setPre: (pre: string) => void;
    cur: string;
    setCur: (cur: string) => void;
}) {
    const [data, setData] = useState<string[]>([]);
    const input = useRef<HTMLInputElement>(null);
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

    async function CreateFolder() {
        try {
            const response = await fetch(
                `http://localhost:8080/api/hdfs/mkdir`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        path: `${path}/${input.current?.value || "新建文件夹"}`,
                    }),
                }
            );
        } catch (error) {
            console.error("创建文件夹错误:", error);
        }
    }

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Enter") {
                CreateFolder();
                setIsInput(false);
            }
        }
        if (isInput && input.current) {
            document.addEventListener("keydown", handleKeyDown);
            input.current.focus();
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isInput]);
    return (
        <div className="flex flex-col py-2 px-4 border border-gray-300 w-full">
            {isInput && (
                <input
                    className="px-2 py-1 rounded-sm text-xl font-bold outline-sky-200"
                    defaultValue="新建文件夹"
                    ref={input}
                />
            )}
            {data.map((item: string) => {
                return (() => {
                    if (item.includes(".")) {
                        return (
                            <File
                                key={item}
                                name={item}
                                path={path}
                                {...{ setPre, cur, setCur }}
                            ></File>
                        );
                    } else {
                        return (
                            <Folder
                                key={item}
                                name={item}
                                path={path}
                                setPath={setPath}
                                {...{ setPre, cur, setCur }}
                            ></Folder>
                        );
                    }
                })();
            })}
        </div>
    );
}
