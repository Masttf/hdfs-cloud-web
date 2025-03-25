"use client";
import Content from "@/compoents/content";
import Navbar from "@/compoents/navbar";
import { createContext, useState } from "react";
export const PathContext = createContext({
    path: "",
    setPath: (path: string) => {},
});
export default function Home() {
    const [path, setPath] = useState<string>("/cloud_disk");
    return (
        <PathContext.Provider value={{ path, setPath }}>
            <div className="container flex flex-col mx-auto h-screen">
                <div className="w-full bg-gray-300 px-2">
                    <Navbar />
                </div>
                <div className="w-full flex flex-1">
                    <div className="flex flex-1/4 flex-col bg-gray-100">
                        sidebar
                    </div>
                    <div className="flex-3/4">
                        <Content />
                    </div>
                </div>
            </div>
        </PathContext.Provider>
    );
}
