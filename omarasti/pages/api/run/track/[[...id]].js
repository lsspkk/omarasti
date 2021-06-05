import dbConnect from '../../../../utils/dbConnect'
import Run from '../../../../models/Run'
import User from '../../../../models/User'
import { getSession } from 'next-auth/client'


export default async function handler(req, res) {

  const session = await getSession({ req })
  if (!session) {
    res.status(401).json({})
    return
  }

  await dbConnect()

  try {
    if (req.query.id.includes('show')) {
      // /api/run/track/[trackid]/show

      const user = await User.findOne({ email: session.user.email })
      const totalRuns = await Run.count({ track: req.query.id[0] })
      const query = { $and: [{ track: req.query.id[0] }, { runner: user.id }] }
      const myRuns = await Run.count(query)
      res.status(200).json({ success: true, data: { totalRuns, myRuns } })
    }

    else {
      // /api/run/track/[trackid]

      const runs = await Run.find({ track: req.query.id }).sort('totalTime').populate('runner', '-email')
      res.status(200).json({ success: true, data: runs })
    }
  }
  catch (error) {
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
