import "../styles/globals.css";
import MouseObserver from "../utils/MouseObserver";

function MyApp({ Component, pageProps }) {
  return (
    <MouseObserver>
      <Component {...pageProps} />
    </MouseObserver>
  );
}

export default MyApp;
