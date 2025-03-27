"use client";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { Fileitem } from "@/app/page";
export default function Navbar({
    path,
    setPath,
    setIsInput,
    refresh,
    setRefresh,
    select,
}: {
    path: string;
    setPath: (path: string) => void;
    setIsInput: (isInput: boolean) => void;
    refresh: boolean;
    setRefresh: (fresh: boolean) => void;
    select: RefObject<Set<Fileitem>>;
}) {
    function handleback() {
        if (path === "/cloud_disk") return;
        setPath(path.split("/").slice(0, -1).join("/"));
    }
    function handleDelete() {
        async function Delete(fileName: string) {
            try {
                console.log(fileName);
                const response = await fetch(
                    "http://localhost:8080/api/hdfs/delete",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            path: `${path}/${fileName}`,
                        }),
                    }
                );
                setRefresh(!refresh);
            } catch (e) {
                console.log(e);
                alert("删除失败");
            }
        }
        select.current.forEach((item) => {
            Delete(item.name);
        });
    }

    function handleDownload() {
        async function Download(fileName: string) {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/hdfs/download?hdfsFilePath=${path}/${fileName}`
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
                    `${fileName}`;

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
        select.current.forEach((item) => {
            Download(item.name);
        });
    }
    async function handleFileUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const files = event.target.files;
        if (!files || files.length === 0) {
            return;
        }
        const file = files[0];
        const hdfsPath = path; // 使用当前路径作为上传目标路径

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("hdfsPath", hdfsPath);
            console.log(formData);
            const response = await fetch(
                "http://localhost:8080/api/hdfs/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );
            setRefresh(!refresh);
        } catch (e) {
            console.error(e);
            alert("上传失败，请检查网络");
        }
    }
    const query = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleEnterKey = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                if (!query.current) return;
                setPath(query.current?.value);
            }
        };
        document.addEventListener("keydown", handleEnterKey);
        return () => {
            document.removeEventListener("keydown", handleEnterKey);
        };
    }, []);
    return (
        <div className="px-1 flex gap-4 h-14 text-xl items-center">
            <div
                title="返回上一级"
                className="hover:text-sky-500 cursor-pointer"
                onClick={handleback}
            >
                <svg
                    className="text-2xl"
                    viewBox="0 0 448 512"
                    height="1em"
                    width="1em"
                >
                    <use href="#arrow-left" />
                </svg>
            </div>
            <input
                ref={query}
                defaultValue={path}
                className="bg-gray-100 px-2 py-1 flex-1 outline-0 rounded-md font-bold"
            ></input>
            <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e)}
            />
            <div
                title="上传文件"
                className="cursor-pointer hover:text-sky-500"
                onClick={() => document.getElementById("fileInput")?.click()}
            >
                <svg
                    height="1em"
                    width="1em"
                    viewBox="0 0 512 512"
                    className="text-2xl"
                >
                    <use href="#file-import" />
                </svg>
            </div>
            <div
                title="新建文件夹"
                className="cursor-pointer hover:text-sky-500"
                onClick={() => setIsInput(true)}
            >
                <svg
                    className="text-2xl"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                >
                    <use href="#folder-plus" />
                </svg>
            </div>
            <div
                title="下载文件"
                className="cursor-pointer hover:text-sky-500"
                onClick={handleDownload}
            >
                <svg
                    height="1em"
                    width="1em"
                    viewBox="0 0 512 512"
                    className="text-2xl"
                >
                    <use href="#download" />
                </svg>
            </div>
            <div
                title="删除"
                className=" hover:text-sky-500 cursor-pointer"
                onClick={handleDelete}
            >
                <svg
                    height="1em"
                    width="1em"
                    viewBox="0 0 448 512"
                    className="text-2xl"
                >
                    <use href="#trash" />
                </svg>
            </div>
            <div
                title="刷新"
                className=" hover:text-sky-500 cursor-pointer"
                onClick={() => setRefresh(!refresh)}
            >
                <svg
                    height="1em"
                    width="1em"
                    viewBox="0 0 512 512"
                    className="text-2xl"
                >
                    <use href="#refresh" />
                </svg>
            </div>
        </div>
    );
}
