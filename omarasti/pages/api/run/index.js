import dbConnect from '../../../utils/dbConnect'
import User from '../../../models/User'
import Run from '../../../models/Run'
import { getSession } from '../auth'

export default async function handler(req, res) {
  const { method } = req
  const session = await getSession(req, res)
  if (!session) {
    res.status(401).json({})
    return
  }

  await dbConnect()

  try {
    const user = await User.findOne({ email: session.user.email })
    // MIGRATION NOTE: Mongoose 6+ - find() and populate() work the same way
    // sort() method remains unchanged
    const runs = await Run.find({ runner: user.id }).populate('track', '-modified -owner -markers').sort('start')

    if (method === 'GET') {
      res.status(201).json({ success: true, data: runs })
    }

    if (method === 'POST') {
      if (runs.length > 5) {
        // TODO: remove the earliest
        // MIGRATION NOTE: Mongoose 6+ - findByIdAndDelete() works the same way
        await Run.findByIdAndDelete(runs[0].id)
      }
      const newRun = { ...req.body, runner: user.id }
      // MIGRATION NOTE: Mongoose 6+ - create() works the same way
      const run = await Run.create(newRun)
      res.status(201).json({ success: true, data: run })
    }
  } catch (error) {
    console.log(error)
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
