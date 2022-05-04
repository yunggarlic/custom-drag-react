import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Draggable from "./Draggable";
import { useEffect, useState } from "react";
import DragArea from "./DragArea";

export default function Home() {
    return (
        <div className="absolute inset-0 overflow-hidden select-none">
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Draggables Test" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <DragArea />
        </div>
    );
}
