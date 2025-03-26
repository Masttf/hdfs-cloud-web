"use client";
import React, { useContext } from "react";
import { PathContext } from "@/app/page";
export default function Navbar({
    setIsInput,
}: {
    setIsInput: (isInput: boolean) => void;
}) {
    const { path, setPath } = useContext(PathContext);
    function handleClick() {
        if (path === "/cloud_disk") return;
        setPath(path.split("/").slice(0, -1).join("/"));
    }
    return (
        <div className="px-1 flex gap-4 h-14 text-xl items-center">
            <div
                title="返回上一级"
                className="hover:text-sky-500 cursor-pointer"
                onClick={handleClick}
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
            <div className="bg-gray-100 px-2 py-1 flex-1 rounded-md">
                {path}
            </div>
            <div
                title="上传文件"
                className=" hover:text-sky-500 cursor-pointer"
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
                className="hover:text-sky-500 cursor-pointer"
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
            <div title="删除" className=" hover:text-sky-500 cursor-pointer">
                <svg
                    height="1em"
                    width="1em"
                    viewBox="0 0 448 512"
                    className="text-2xl"
                >
                    <use href="#trash" />
                </svg>
            </div>
        </div>
    );
}
