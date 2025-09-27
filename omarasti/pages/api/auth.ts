import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        url: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
      },
    }),
  ],
  database: null,
}

export async function getSession(
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
) {
  return getServerSession(...args, authOptions)
}
