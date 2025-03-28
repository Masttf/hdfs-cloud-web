import React from "react";
import { RefObject } from "react";
import { Fileitem } from "@/app/page";
import { HdfsService } from "../services/hdfsService";
import { message } from "antd";
export default function File({
    name,
    path,
    select,
}: {
    name: string;
    path: string;
    select: RefObject<Set<Fileitem>>;
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
    return (
        <div
            className="flex items-center gap-4 px-2 py-1 rounded-sm text-xl font-bold hover:bg-sky-200"
            onDoubleClick={() => Download(name)}
        >
            <input
                type="checkbox"
                className="w-4 h-4"
                onChange={(e) => {
                    if (e.target.checked) {
                        select.current?.add({ name, type: "file" });
                    } else {
                        select.current?.delete({ name, type: "file" });
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
            {name}
        </div>
    );
}
