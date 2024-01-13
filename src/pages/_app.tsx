import { AppProps } from 'next/app';
import { Kanit } from 'next/font/google';

import '../style/globals.css';

const kanit = Kanit({
    weight: ['200'],
    subsets: ['thai', 'latin', 'latin-ext'],
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <main className={kanit.className}>
            <Component {...pageProps} />
        </main>
    );
}

export default MyApp;
