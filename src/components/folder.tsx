import React from "react";
export default function Folder({
    name,
    path,
    setPath,
    setPre,
    cur,
    setCur,
}: {
    name: string;
    path: string;
    setPath: (path: string) => void;
    setPre: (pre: string) => void;
    cur: string;
    setCur: (cur: string) => void;
}) {
    const folderName = `folder-${name}`;
    return (
        <div
            id={folderName}
            className="flex items-center gap-4 px-2 py-1 rounded-sm text-xl font-bold cursor-default hover:bg-sky-200"
            onDoubleClick={() => setPath(`${path}/${name}`)}
            onClick={() => {
                setPre(cur);
                setCur(folderName);
            }}
        >
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
