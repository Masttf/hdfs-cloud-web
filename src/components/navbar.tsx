"use client";
import React, { useEffect } from "react";

function getfileName(name: string) {
    return name.split("-").slice(1).join().replace("-", ".");
}
export default function Navbar({
    path,
    setPath,
    setIsInput,
    pre,
    setPre,
    cur,
    setCur,
}: {
    path: string;
    setPath: (path: string) => void;
    setIsInput: (isInput: boolean) => void;
    pre: string;
    setPre: (pre: string) => void;
    cur: string;
    setCur: (cur: string) => void;
}) {
    useEffect(() => {
        console.log(pre, cur);
        if (pre !== "") {
            const dom = document.querySelector(`#${pre}`);
            dom?.classList.remove("chose");
        }
        if (cur !== "") {
            const dom = document.querySelector(`#${cur}`);
            dom?.classList.add("chose");
        }
    }, [pre, cur]);
    function handleback() {
        if (path === "/cloud_disk") return;
        setPre("");
        setCur("");
        setPath(path.split("/").slice(0, -1).join("/"));
    }
    async function handleDelete() {
        if (cur === "") return;
        const fileName = getfileName(cur);
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
        } catch (e) {
            console.log(e);
            alert("删除失败");
        }
    }
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
            <div className="bg-gray-100 px-2 py-1 flex-1 rounded-md font-bold">
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
                title="下载文件"
                className=" hover:text-sky-500 cursor-pointer"
                onClick={() => {
                    if (cur === "" || !cur.startsWith("file-")) return;
                    document
                        .querySelector<HTMLElement>(`#${cur}`)
                        ?.dispatchEvent(
                            new MouseEvent("dblclick", { bubbles: true })
                        );
                }}
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
        </div>
    );
}
