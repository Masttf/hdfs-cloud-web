import React from "react";
import { RefObject } from "react";
import { Fileitem } from "@/app/page";
export default function File({
    name,
    path,
    select,
}: {
    name: string;
    path: string;
    select: RefObject<Set<Fileitem>>;
}) {
    async function Download(name: string) {
        try {
            const response = await fetch(
                `http://localhost:8080/api/hdfs/download?hdfsFilePath=${path}/${name}`
            );

            if (!response.ok) throw new Error("下载失败");

            // 获取文件名（两种方式）
            const filename =
                // 方式1：从Content-Disposition头解析（推荐）
                response.headers
                    .get("content-disposition")
                    ?.split("filename=")[1]
                    .replace(/"/g, "") ||
                // 方式2：手动拼接（后备方案）
                `${name}`;

            // 创建可下载链接
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();

            // 清理资源
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("下载错误:", error);
            alert("文件下载失败，请重试");
        }
    }
    const fileName = `file-${name.split(".").join("-")}`;
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
