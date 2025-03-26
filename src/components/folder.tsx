import React from "react";
import { PathContext } from "@/app/page";
export default function Folder({ name }: { name: string }) {
    const { path, setPath } = React.useContext(PathContext);
    return (
        <div
            className="group flex justify-between px-2 py-1 rounded-sm text-xl font-bold cursor-default hover:bg-sky-200"
            onDoubleClick={() => setPath(`${path}/${name}`)}
        >
            {name}
        </div>
    );
}
