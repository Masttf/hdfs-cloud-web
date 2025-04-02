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
    refresh,
    setRefresh,
    select,
}: {
    path: string;
    setPath: (path: string) => void;
    refresh: boolean;
    setRefresh: (fresh: boolean) => void;
    select: RefObject<Set<Fileitem>>;
}) {
    const [data, setData] = useState<FileInfo[]>([]);
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

    return (
        <div className="flex flex-col gap-1 px-4 py-2 border border-gray-300 w-full">
            <div className="w-full px-2 flex justify-between items-center text-xl font-bold">
                <div className="w-1/3 pl-[4.25rem]">文件名</div>
                <div className="w-1/3 text-center">修改时间</div>
                <div className="w-1/3 text-right">大小</div>
            </div>
            <div className="overflow-scroll">
                {data.map((item: FileInfo) => {
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
        </div>
    );
}
