import "@/styles/globals.css";
import Icon from "@/components/icon";
import "@ant-design/v5-patch-for-react-19";
import { AntdRegistry } from "@ant-design/nextjs-registry";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN">
            <body>
                <Icon />
                <AntdRegistry>{children}</AntdRegistry>
            </body>
        </html>
    );
}
