import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

export async function getSession(...args) {
  return getServerSession(...args, authOptions)
}
