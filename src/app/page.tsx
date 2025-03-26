"use client";
import Content from "@/components/content";
import Navbar from "@/components/navbar";
import { useState } from "react";
export default function Home() {
    const [path, setPath] = useState<string>("/cloud_disk");
    const [isInput, setIsInput] = useState<boolean>(false);
    const [pre, setPre] = useState<string>("");
    const [cur, setCur] = useState<string>("");
    const [refresh, setRefresh] = useState<boolean>(false);
    return (
        <div className="container flex flex-col mx-auto h-screen">
            <div className="w-full bg-gray-200 px-2">
                <Navbar
                    path={path}
                    setPath={setPath}
                    setIsInput={setIsInput}
                    {...{ pre, setPre, cur, setCur, refresh, setRefresh }}
                />
            </div>
            <div className="w-full flex flex-1">
                <Content
                    path={path}
                    setPath={setPath}
                    isInput={isInput}
                    setIsInput={setIsInput}
                    {...{ setPre, cur, setCur, refresh, setRefresh }}
                />
            </div>
        </div>
    );
}
