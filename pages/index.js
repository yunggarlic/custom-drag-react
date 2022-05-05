import Head from "next/head";
import DragArea from "./DragArea";
import MouseObserver from "../utils/MouseObserver";

export default function Home() {
    return (
        <div className="absolute inset-0 overflow-hidden select-none">
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Draggables Test" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MouseObserver>
                <DragArea />
            </MouseObserver>
        </div>
    );
}
