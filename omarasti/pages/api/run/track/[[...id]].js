import dbConnect from '../../../../utils/dbConnect'
import Run from '../../../../models/Run'
import User from '../../../../models/User'
import { getSession } from '../../auth'

export const getRunAmounts = async (trackId, req, res) => {
  const session = await getSession(req, res)
  if (!session) {
    throw new Error('no session')
  }
  const user = await User.findOne({ email: session.user.email })
  const totalRuns = await Run.count({ track: trackId })
  const query = { $and: [{ track: trackId }, { runner: user.id }] }
  const myRuns = await Run.count(query)
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
      const runAmounts = getRunAmounts(trackId, req)
      res.status(200).json({ success: true, data: runAmounts })
    } else {
      // /api/run/track/[trackid]

      const runs = await Run.find({ track: req.query.id }).sort('totalTime').populate('runner', '-email')
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
