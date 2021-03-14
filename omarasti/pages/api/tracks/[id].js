
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
    const tracks = await Track.find(query, {projection:{_id:0}}).populate("owner markers")  
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

  const track = await Track.findById(req.query.id).populate('owner')
  if (track.owner.email !== session.user.email) {
    // not the track owner
    res.status(401).json({})
    return
  }

  if (method === 'PUT') {
    await Track.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
      runValidators: true,
    })
    console.log('put')
  }
  else if (method === 'DELETE') {
    try {
      await Track.findByIdAndDelete(req.query.id)
      res.status(400).json({ success: true })
    } catch (error) {
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
