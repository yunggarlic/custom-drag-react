import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Draggable from './Draggable';
import { useEffect, useState } from 'react';
import DragArea from './DragArea';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loaded ? console.log(initMessage) : setLoaded(true);
  }, [loaded]);

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

const initMessage =
  'Hello! I see that you have opened the dev tools and are able to read this message.\n\nPerhaps you are too curious for your own good.\n\nIn any case, it ought to be noted that this website has a particular flaw: the drag and drop feature of the site becomes inoperable when starting on a mouse-oriented device and switching to a touch-oriented device, and vice versa.\n\nI accept this flaw as a feature, for who could possibly have this capability? I presume iPad consumers that use a mouse attachment. And to you - scum - I say, pick one or the other; touch or mouse it is your burden to drop to one side of the fence.\n\nOtherwise, be sure of this: I have a very particular set of skills. I will find you. And I will kill you.';
