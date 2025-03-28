"use client";
import React, { RefObject, useEffect, useRef } from "react";
import { Fileitem } from "@/app/page";
import { HdfsService } from "../services/hdfsService";
import { message } from "antd";
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
