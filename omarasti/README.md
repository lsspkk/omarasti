# omarasti next

Käytössä kirjastot

- Next-auth - https://www.npmjs.com/package/next-auth
- Tailwind - https://tailwindcss.com/components
- Recoil - https://recoiljs.org/docs/
- Mongoose - https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose



# TODO
- Tulosvertailu jaetun radan katselussa, (ennen ja) jälkeen suunnistuksen.
- Jos rataa muokataan, varoita radan tallennuksen yhteydessä,
  mikäli radalle on tallennettu tuloksia: Jos talletat, niin tulokset tyhjennetään.
- Virallinen Google login grafiikka kirjautumislinkkiin.
- Käytetään cookieita toiminnallisuus.
- Esittelysivu suunnistuksesta.
- Karttojen valinta.
- Taitotason valinta (metrit, kuinka läheltä rasti näkyy) ja tallennus suunnistustulokseen.
- Korjaa kuvausten näkyminen, kun rasti on näkyvissä.
- Päivitä tailwind 2:een
- Päivitä uusimpaa next.js:ään



# Radan jakaminen

Kevyempi ratkaisu ryhmille.


# Ryhmät

Tarvittais "urheiluseurat" eli kaveripiirit eli ryhmät,
jotta kaveripiirejä, koululuokkia tms. voi olla useita.
Esim. admin generoi salasanan, jolla voi liittyä ryhmään, ja jakaa sen
täysin omarastin ulkopuolella.


# Tulosten tallennus

Tallenna ajat ja juoksijat.
Reittivertailuun tallenna vaikka enintään viisi reittiä,
käyttäjän valinta on, tallentaako reitin.
Reittivertailun katseluun voi valita haluamansa juoksijat.



# vercel eikä netlify

Koska mongoose:n yhteyden voi jättää päälle. 
netlifyyn tarviis toisen ratkaisun, tai sit välittää backend-kutsut eteenpäin ihan oikealle API:lle.



# next-on-netlify
Kirjastopa deprekoitui, uusi käytössä oleva on
https://github.com/netlify/netlify-plugin-nextjs



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
