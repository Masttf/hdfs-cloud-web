"use client";
import React, { useContext } from "react";
import { PathContext } from "@/app/page";
export default function Navbar() {
    const { path, setPath } = useContext(PathContext);
    return <div>{path}</div>;
}
