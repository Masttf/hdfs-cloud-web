"use client";
import React, { useContext } from "react";
import { PathContext } from "@/app/page";
export default function Navbar() {
    const { path, setPath } = useContext(PathContext);
    function handleClick() {
        if (path === "/cloud_disk") return;
        setPath(path.split("/").slice(0, -1).join("/"));
    }
    return (
        <div className="px-1 flex gap-4 h-14 text-xl items-center">
            <div
                className="hover:text-sky-500 cursor-pointer"
                onClick={handleClick}
            >
                回退
            </div>
            <div className="bg-gray-100 px-2 py-1 flex-1 rounded-md">
                {path}
            </div>
        </div>
    );
}
