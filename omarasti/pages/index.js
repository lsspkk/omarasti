import Head from 'next/head'
import Layout from '../components/Layout'
import { signin, useSession } from 'next-auth/client'

export default function Home() {
  const [session, loading] = useSession()
  return (
    <Layout>
      <h3>Tervetuloa OMArastiin.</h3>

      { !session && (
        <div>
          <button className="signInButton" onClick={() => signin('google')}>Kirjaudu</button>

          <p>
            Kirjaudu Google-tunnuksella sisälle omaRastiin,
            niin voit luoda suunnistusratoja, jakaa niitä kavereillesi,
            ja käydä suunnistamassa radan puhelimen kanssa.
          </p>
          <p>Sähköpostiosoitettasi ei välitetä muihin palveluihin,
            eikä käytöstäsi kerätä mitään tilastoja.
            Kirjautumista käytetään ainoastaan siihen, että
            vain sinä voit muokata tekemiäsi ratoja. Samoin ainoastaan
            sinulla on pääsy valitsemaasi "suunnistajanimeen",
            jolla esiinnyt palvelun muille käyttäjille.
          </p>
        </div>
      )}


      <h1>Ole ratamestari</h1>

      <ul>
        <li>Tee tampereen alueen kartalle oma suunnistusrata.</li>
        <li>Jaa linkki rataan kavereillesi, ja...</li>
      </ul>


      <h1>Suunnista</h1>

      <ul>
        <li>Kun olet lähellä rastia, "näät" sen puhelimen ruudulla.</li>
        <li>Kun olet aivan rastin vieressä, voit "leimata" puhelimella.</li>
      </ul>

    </Layout>
  )
}
