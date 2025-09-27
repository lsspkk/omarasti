import dbConnect from '../../../utils/dbConnect'
import Track, { TrackPopulatedType } from '../../../models/Track'
import User from '../../../models/User'
import { getSession } from '../auth'

export async function getTracks(req, res) {
  const session = await getSession(req, res)
  if (!session) {
    return { success: false, data: [] }
  }
  try {
    const user = await User.findOne({ email: session.user.email })
    const query = { $or: [{ published: true }, { owner: user.id }] }
    const tracks = await Track.find(query).select('-_id').populate('owner markers')

    return { success: true, data: tracks }
  } catch (error) {
    console.log(error)
    return { success: false, data: [] }
  }
}

export async function getTrack(shortId, req, res) {
  const session = await getSession(req, res)
  if (!session) {
    throw new Error('no session')
  }
  const tracks = await Track.find({ shortId: shortId })
    .populate('owner', '-email -__v')
    .select('-markers._id -markers.latlng._id')
  return tracks.length === 0 ? null : tracks[0]
}

export default async function handler(req, res) {
  const { method } = req
  const session = await getSession(req, res)
  if (!session) {
    res.status(401).json({})
    return
  }

  await dbConnect()

  const track = await Track.findById(req.query.id).populate('owner')
  const populatedTrack = track as unknown as TrackPopulatedType
  if (populatedTrack.owner?.email !== session.user.email) {
    // not the track owner
    res.status(401).json({})
    return
  }

  if (method === 'PUT') {
    await Track.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
      runValidators: true,
    })
  } else if (method === 'DELETE') {
    try {
      await Track.findByIdAndDelete(req.query.id)
      res.status(200).json({ success: true })
    } catch (error) {
      console.log(error) // Log the error for debugging
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
