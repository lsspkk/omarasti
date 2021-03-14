
import dbConnect from '../../../utils/dbConnect'
import Track from '../../../models/Track'
import User from '../../../models/User'

import { getSession } from 'next-auth/client'

export async function getTracks(req) {
  const session = await getSession({ req })
  if (!session) {
    return { success: false, data: [] }
  }
  try {
    const user = await User.findOne({ email: session.user.email })
    const query = { $or: [{ published: true }, { owner: user.id }] }
    const tracks = await Track.find(query).populate("owner").select('-markers._id -markers.latlng._id')
    return { success: true, data: tracks }
  } catch (error) {
    console.log(error)
    return { success: false, data: [] }
  }
}

export default async function handler(req, res) {

  const { method } = req
  const session = await getSession({ req })
  if (!session) {
    res.status(401).json({})
    return
  }

  await dbConnect()

  if (method === 'GET') {
    const response = getTracks(req)
    res.status(response.success ? 200 : 400).json(response)
  }
  else if (method === 'POST') {
    try {
      const user = await User.findOne({ email: session.user.email })
      const newTrack = { ...req.body, owner: user }

      const track = await Track.create(newTrack)
      res.status(201).json({ success: true, data: track })
    } catch (error) {
      console.log(error)
      res.status(400).json({ success: false })
    }
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500kb',
    },
  },
}
