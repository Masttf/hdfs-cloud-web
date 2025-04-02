"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Folder from "./folder";
import File from "./file";
import { RefObject } from "react";
import { Fileitem } from "@/app/page";
import { HdfsService } from "@/services/hdfsService";
import { message } from "antd";
import { FileInfo } from "../services/hdfsService";
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
    const [data, setData] = useState<FileInfo[]>([]);
    const input = useRef<HTMLInputElement>(null);
    useEffect(() => {
        async function fetchData() {
            const result = await HdfsService.listDirectory(path);
            if (result.data) {
                setData(result.data);
            } else if (result.error) {
                message.error(result.error);
            }
        }
        fetchData();
    }, [path, refresh]);

    async function CreateFolder() {
        try {
            const folderPath = `${path}/${
                input.current?.value || "新建文件夹"
            }`;
            const result = await HdfsService.createDirectory(folderPath);
            if (result.error) {
                message.error(result.error);
            } else {
                message.success("文件夹创建成功");
                setRefresh(!refresh);
            }
        } catch (error) {
            message.error("创建文件夹失败");
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
            {data.map((item: FileInfo) => {
                console.log(item);
                return (() => {
                    if (!item.directory) {
                        return (
                            <File
                                key={item.name}
                                name={item.name}
                                path={path}
                                select={select}
                                size={item.size}
                                lastModified={item.lastModified}
                            />
                        );
                    } else {
                        return (
                            <Folder
                                key={item.name}
                                name={item.name}
                                path={path}
                                setPath={setPath}
                                select={select}
                                size={item.size}
                                lastModified={item.lastModified}
                            ></Folder>
                        );
                    }
                })();
            })}
        </div>
    );
}
