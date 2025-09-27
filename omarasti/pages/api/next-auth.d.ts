import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      sub: string
    } & DefaultSession['user']
  }

  interface User {
    sub: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string
  }
}
