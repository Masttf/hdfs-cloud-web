"use client";
import Content from "@/components/content";
import Navbar from "@/components/navbar";
import { createContext, useState } from "react";
export const PathContext = createContext({
    path: "",
    setPath: (path: string) => {},
});
export default function Home() {
    const [path, setPath] = useState<string>("/cloud_disk");
    const [isInput, setIsInput] = useState<boolean>(false);
    return (
        <PathContext.Provider value={{ path, setPath }}>
            <div className="container flex flex-col mx-auto h-screen">
                <div className="w-full bg-gray-200 px-2">
                    <Navbar setIsInput={setIsInput} />
                </div>
                <div className="w-full flex flex-1">
                    <Content isInput={isInput} setIsInput={setIsInput} />
                </div>
            </div>
        </PathContext.Provider>
    );
}
