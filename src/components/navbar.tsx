"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { RefObject, use, useEffect, useRef, useState } from "react";
import { Fileitem } from "@/app/page";
import { HdfsService } from "../services/hdfsService";
import { message } from "antd";
export default function Navbar({
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
    const input = useRef<HTMLInputElement>(null);
    const [isInput, setIsInput] = useState<boolean>(false);
    function handleback() {
        if (isInput) return;
        if (path === "/cloud_disk") return;
        setPath(path.split("/").slice(0, -1).join("/"));
    }
    function handleDelete() {
        async function Delete(fileName: string) {
            try {
                const result = await HdfsService.deleteResource(
                    `${path}/${fileName}`
                );
                if (result.error) {
                    message.error(`删除 ${fileName} 失败: ${result.error}`);
                } else {
                    message.success(`删除 ${fileName} 成功`);
                    setRefresh(!refresh);
                }
            } catch (error) {
                message.error(`删除 ${fileName} 失败`);
            }
        }
        select.current?.forEach((item) => {
            console.log(item.name);
            Delete(item.name);
        });
    }

    function handleDownload() {
        async function Download(fileName: string) {
            try {
                const result = await HdfsService.downloadFile(
                    `${path}/${fileName}`
                );
                if (result.error) {
                    message.error(`下载 ${fileName} 失败: ${result.error}`);
                } else {
                    message.success(`下载 ${fileName} 成功`);
                }
            } catch (error) {
                message.error(`下载 ${fileName} 失败`);
            }
        }
        select.current?.forEach((item) => {
            if (item.type === "file") {
                Download(item.name);
            }
        });
    }
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
    async function handleFileUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const files = event.target.files;
        if (!files || files.length === 0) {
            return;
        }
        const file = files[0];

        try {
            const result = await HdfsService.uploadFile(file, path);
            if (result.error) {
                message.error(`上传文件失败: ${result.error}`);
            } else {
                message.success("文件上传成功");
                setRefresh(!refresh);
            }
        } catch (error) {
            message.error("文件上传失败");
        }
    }

    const query = useRef<HTMLInputElement>(null);
    const curPath = useRef<string>(path);
    useEffect(() => {
        curPath.current = path;
        if (query.current) {
            query.current.value = path;
        }
    }, [path]);
    async function handleQuery() {
        if (!query.current) return;
        try {
            const result = await HdfsService.isDirectoryExist(
                query.current?.value
            );
            if (result.error) {
                message.error(`查找目录失败: ${result.error}`);
                if (query.current) {
                    query.current.value = curPath.current;
                }
            } else if (query.current) {
                setPath(query.current.value);
            }
        } catch (error) {
            message.error("网络请求失败，请检查连接");
            if (query.current) {
                query.current.value = curPath.current;
            }
        }
    }
    useEffect(() => {
        const handleEnterKey = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                handleQuery();
            }
        };
        document.addEventListener("keydown", handleEnterKey);
        return () => {
            document.removeEventListener("keydown", handleEnterKey);
        };
    }, []);
    useEffect(() => {
        if (isInput) {
            input.current?.focus();
        }
    }, [isInput]);
    return (
        <div className="px-1 flex gap-4 h-14 text-xl items-center">
            <div
                title="返回上一级"
                className={`hover:text-sky-500 cursor-pointer ${
                    isInput || path === "/cloud_disk" ? "!text-gray-400" : ""
                }`}
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
            <div className="flex-1 flex">
                {!isInput && (
                    <input
                        type="text"
                        ref={query}
                        className="w-full bg-gray-100 px-2 py-1 outline-0 rounded-md font-bold"
                    />
                )}
                {isInput && (
                    <div className="w-full flex">
                        <input
                            type="text"
                            ref={input}
                            placeholder="请输入文件夹名"
                            className=" bg-gray-100 flex-1 px-2 py-1 outline-0 rounded-l-md font-bold"
                        />
                        <button
                            className="bg-sky-500 text-white px-2 py-1 cursor-pointer border-r-2 border-solid"
                            onClick={() => {
                                CreateFolder();
                                setIsInput(false);
                            }}
                        >
                            创建
                        </button>
                        <button
                            className="bg-sky-500 text-white px-2 py-1 rounded-r-md cursor-pointer"
                            onClick={() => {
                                setIsInput(false);
                            }}
                        >
                            取消
                        </button>
                    </div>
                )}
            </div>
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
