import dbConnect from '../../../../utils/dbConnect'
import { RunModel } from '../../../../models/Run'
import { getSession } from '../../auth'
import UserModel from '../../../../models/User'

export const getRunAmounts = async (trackId, req, res) => {
  const session = await getSession(req, res)
  if (!session) {
    throw new Error('no session')
  }
  const user = await UserModel.findOne({ email: session.user.email })
  const totalRuns = await RunModel.countDocuments({ track: trackId })
  const query = { $and: [{ track: trackId }, { runner: user._id }] }
  const myRuns = (await RunModel.countDocuments(query)) ?? 0
  return { totalRuns, myRuns }
}

export default async function handler(req, res) {
  const session = await getSession(req, res)
  if (!session) {
    res.status(401).json({})
    return
  }

  await dbConnect()

  try {
    if (req.query.id.includes('show')) {
      // /api/run/track/[trackid]/show

      const trackId = req.query.id[0]
      const runAmounts = await getRunAmounts(trackId, req, res)
      res.status(200).json({ success: true, data: runAmounts })
    } else {
      // /api/run/track/[trackid]

      const runs = await RunModel.find({ track: req.query.id }).sort('totalTime').populate('runner', '-email')
      res.status(200).json({ success: true, data: runs })
    }
  } catch (error) {
    console.log('error at /api/run/track/', req.query, error)
    res.status(500).json({ success: false })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500kb',
    },
  },
}
