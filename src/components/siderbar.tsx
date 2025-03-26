import React, { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import pathContext from "@/compoents/pathContext";
export default function Siderbar() {
    const path = useContext(pathContext);
    const [data, setData] = useState([]);
    useEffect(() => {
        const response = fetch("http://localhost:9000/api/hdfs");
    }, [path]);
    return <div></div>;
}
