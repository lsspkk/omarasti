import Head from 'next/head'
import styles from '../styles/Layout.module.css'
import Header from './Header'

const Layout = ({ children }) => (
  <>
    <Head>
      <title>OMArasti</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header />

    <main className={styles.container}>{children}</main>
  </>
);

export default Layout;