import React from "react";
import { RefObject } from "react";
import { Fileitem } from "@/app/page";
export default function Folder({
    name,
    path,
    setPath,
    select,
}: {
    name: string;
    path: string;
    setPath: (path: string) => void;
    select: RefObject<Set<Fileitem>>;
}) {
    return (
        <div
            className="flex items-center gap-4 px-2 py-1 rounded-sm text-xl font-bold cursor-default hover:bg-sky-200"
            onDoubleClick={() => setPath(`${path}/${name}`)}
        >
            <input
                type="checkbox"
                className="w-4 h-4"
                onChange={(e) => {
                    if (e.target.checked) {
                        select.current?.add({ name, type: "folder" });
                    } else {
                        select.current?.delete({ name, type: "folder" });
                    }
                }}
            />
            <svg
                className="text-xl text-amber-300"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
            >
                <use href="#folder" />
            </svg>
            {name}
        </div>
    );
}
