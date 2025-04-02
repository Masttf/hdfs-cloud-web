"use client";
import Content from "@/components/content";
import Navbar from "@/components/navbar";
import { useState } from "react";
import { useRef } from "react";

export interface Fileitem {
    name: string;
    type: "file" | "folder";
}
export default function Home() {
    const [path, setPath] = useState<string>("/cloud_disk");
    const [refresh, setRefresh] = useState<boolean>(false);
    const select = useRef<Set<Fileitem>>(new Set<Fileitem>());
    return (
        <div className="container flex flex-col mx-auto h-screen">
            <div className="w-full bg-gray-200 px-2">
                <Navbar
                    path={path}
                    setPath={setPath}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    select={select}
                />
            </div>
            <div className="w-full flex flex-1">
                <Content
                    path={path}
                    setPath={setPath}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    select={select}
                />
            </div>
        </div>
    );
}
