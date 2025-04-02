import React from "react";
import { RefObject } from "react";
import { Fileitem } from "@/app/page";
import { HdfsService } from "../services/hdfsService";
import { message } from "antd";

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
export default function File({
    name,
    path,
    select,
    size,
    lastModified,
}: {
    name: string;
    path: string;
    select: RefObject<Set<Fileitem>>;
    size: number;
    lastModified: number;
}) {
    async function Download(fileName: string) {
        try {
            const result = await HdfsService.downloadFile(
                `${path}/${fileName}`
            );
            if (result.error) {
                message.error(`下载 ${fileName} 失败: ${result.error}`);
            } else {
                message.success(`下载 ${fileName} 成功`);
            }
        } catch (error) {
            message.error(`下载 ${fileName} 失败`);
        }
    }
    const file: Fileitem = { name: name, type: "file" };
    return (
        <div
            className="w-full flex items-center px-2 py-1 rounded-sm text-xl font-bold hover:bg-sky-200"
            onDoubleClick={() => Download(name)}
        >
            <div className="flex items-center gap-4 w-1/3">
                <input
                    type="checkbox"
                    className="w-4 h-4"
                    onChange={(e) => {
                        if (e.target.checked) {
                            select.current?.add(file);
                        } else {
                            select.current?.delete(file);
                        }
                    }}
                />
                <svg
                    className="text-xl text-slate-400"
                    viewBox="0 0 348 512"
                    height="1em"
                    width="1em"
                >
                    <use href="#file" />
                </svg>
                <div>{name}</div>
            </div>
            <div className="w-1/3 text-center">{formatDate(lastModified)}</div>
            <div className="w-1/3 text-right">{formatSize(size)}</div>
        </div>
    );
}
