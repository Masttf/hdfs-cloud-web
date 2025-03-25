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
    async function Download(name: string) {
        try {
            const response = await fetch(
                `http://localhost:8080/api/hdfs/download?hdfsFilePath=${path}/${name}`
            );

            if (!response.ok) throw new Error("下载失败");

            // 获取文件名（两种方式）
            const filename =
                // 方式1：从Content-Disposition头解析（推荐）
                response.headers
                    .get("content-disposition")
                    ?.split("filename=")[1]
                    .replace(/"/g, "") ||
                // 方式2：手动拼接（后备方案）
                `${name}`;

            // 创建可下载链接
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();

            // 清理资源
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("下载错误:", error);
            alert("文件下载失败，请重试");
        }
    }
    return (
        <div className="flex flex-col p-2">
            {data.map((item: string) => {
                return (() => {
                    if (item.includes(".")) {
                        return (
                            <div
                                key={item}
                                className="px-2 py-1 rounded-sm text-xl font-bold hover:bg-sky-200"
                                onClick={() => Download(item)}
                            >
                                {item}
                            </div>
                        );
                    } else {
                        return (
                            <div
                                key={item}
                                className="px-2 py-1 rounded-sm text-xl font-bold cursor-default hover:bg-sky-200"
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
