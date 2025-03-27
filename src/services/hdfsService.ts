import { message } from "antd";

interface FileInfo {
    name: string;
    size: number;
    directory: boolean;
}

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

const API_BASE_URL = "http://localhost:8080/api/hdfs";

export const HdfsService = {
    async uploadFile(
        file: File,
        path: string = "/cloud_disk"
    ): Promise<ApiResponse<{ message: string }>> {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("path", path);

            const response = await fetch(`${API_BASE_URL}/files`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "文件上传失败");
            }
            return { data: await response.json() };
        } catch (error: unknown) {
            const err = error as Error;
            message.error(err.message || "文件上传失败");
            return { error: err.message };
        }
    },

    async createDirectory(
        path: string
    ): Promise<ApiResponse<{ message: string }>> {
        try {
            const response = await fetch(`${API_BASE_URL}/directories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ path }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "目录创建失败");
            }
            return { data: await response.json() };
        } catch (error: unknown) {
            const err = error as Error;
            message.error(err.message || "目录创建失败");
            return { error: err.message };
        }
    },

    async downloadFile(path: string): Promise<void> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/files?path=${encodeURIComponent(path)}`
            );

            if (!response.ok) {
                throw new Error("文件下载失败");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = path.split("/").pop() || "file";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error: unknown) {
            const err = error as Error;
            message.error(err.message || "文件下载失败");
        }
    },

    async listDirectory(
        path: string = "/cloud_disk"
    ): Promise<ApiResponse<FileInfo[]>> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/contents?path=${encodeURIComponent(path)}`
            );

            if (!response.ok) {
                throw new Error("获取目录内容失败");
            }
            return { data: await response.json() };
        } catch (error: unknown) {
            const err = error as Error;
            message.error(err.message || "获取目录内容失败");
            return { error: err.message };
        }
    },

    async deleteResource(path: string): Promise<ApiResponse<void>> {
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ path }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "删除操作失败");
            }
            return { data: undefined };
        } catch (error: unknown) {
            const err = error as Error;
            message.error(err.message || "删除操作失败");
            return { error: err.message };
        }
    },

    async getFileMetadata(
        hdfsFilePath: string
    ): Promise<ApiResponse<FileInfo>> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/metadata?hdfsFilePath=${encodeURIComponent(
                    hdfsFilePath
                )}`
            );

            if (!response.ok) {
                throw new Error("获取文件元数据失败");
            }
            return { data: await response.json() };
        } catch (error: unknown) {
            const err = error as Error;
            message.error(err.message || "获取文件元数据失败");
            return { error: err.message };
        }
    },
};
