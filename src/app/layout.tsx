import "@/styles/globals.css";
import Icon from "@/components/icon";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN">
            <body>
                <Icon />
                {children}
            </body>
        </html>
    );
}
