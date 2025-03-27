"use client";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Folder from "./folder";
import File from "./file";
import { RefObject } from "react";
import { Fileitem } from "@/app/page";
import { HdfsService } from "../services/hdfsService";
interface fileInfo {
    name: string;
    size: number;
    directory: boolean;
}
export default function Content({
    path,
    setPath,
    isInput,
    setIsInput,
    refresh,
    setRefresh,
    select,
}: {
    path: string;
    setPath: (path: string) => void;
    isInput: boolean;
    setIsInput: (isInput: boolean) => void;
    refresh: boolean;
    setRefresh: (fresh: boolean) => void;
    select: RefObject<Set<Fileitem>>;
}) {
    const [data, setData] = useState<fileInfo[]>([]);
    const input = useRef<HTMLInputElement>(null);
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await HdfsService.listDirectory(path);
                if (data) {
                    setData(data);
                }
            } catch (error) {
                console.error("获取目录内容失败:", error);
            }
        }
        fetchData();
    }, [path, refresh]);

    async function CreateFolder() {
        try {
            const folderPath = `${path}/${
                input.current?.value || "新建文件夹"
            }`;
            await HdfsService.createDirectory(folderPath);
            setRefresh(!refresh);
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
        <div className="flex flex-col gap-1 py-2 px-4 border border-gray-300 w-full">
            {isInput && (
                <input
                    className="px-2 py-1 rounded-sm text-xl font-bold outline-sky-200"
                    defaultValue="新建文件夹"
                    ref={input}
                />
            )}
            {data.map((item: fileInfo) => {
                console.log(item);
                return (() => {
                    if (!item.directory) {
                        return (
                            <File
                                key={item.name}
                                name={item.name}
                                path={path}
                                select={select}
                            ></File>
                        );
                    } else {
                        return (
                            <Folder
                                key={item.name}
                                name={item.name}
                                path={path}
                                setPath={setPath}
                                select={select}
                            ></Folder>
                        );
                    }
                })();
            })}
        </div>
    );
}
