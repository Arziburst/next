
// Core
import { AppProps } from 'next/app';
// import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

// export const getStaticProps: GetStaticProps = async context => {
//   // ...
// }

// export const getStaticPaths: GetStaticPaths = async () => {
//   // ...
// }

// export const getServerSideProps: GetServerSideProps = async context => {
//   // ...
// }

// import { NextApiRequest, NextApiResponse } from 'next'

// export default (req: NextApiRequest, res: NextApiResponse) => {
//   // ...
// }

import { GlobalStyles } from '../assets';

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <GlobalStyles />
            <Component { ...pageProps } />
        </>
    );
}

export default App;

