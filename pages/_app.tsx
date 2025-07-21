import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../styles/globals.css";
import { Poppins, Libre_Baskerville } from 'next/font/google';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--bodyfont',
  display: 'swap',
});

const libre_baskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--headingfont',
  display: 'swap',
});


import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${poppins.variable} ${libre_baskerville.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
