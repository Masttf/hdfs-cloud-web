import React from "react";
import { RefObject } from "react";
import { Fileitem } from "@/app/page";
function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
}
export default function Folder({
    name,
    path,
    setPath,
    select,
    size,
    lastModified,
}: {
    name: string;
    path: string;
    setPath: (path: string) => void;
    select: RefObject<Set<Fileitem>>;
    size: number;
    lastModified: number;
}) {
    return (
        <div
            className="w-full flex items-center px-2 py-1 rounded-sm text-xl font-bold cursor-default hover:bg-sky-200"
            onDoubleClick={() => setPath(`${path}/${name}`)}
        >
            <div className="flex items-center gap-4 w-1/3">
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
                <div>{name}</div>
            </div>
            <div className="w-1/3 text-center">{formatDate(lastModified)}</div>
            <div className="w-1/3 text-right">{formatSize(size)}</div>
        </div>
    );
}
