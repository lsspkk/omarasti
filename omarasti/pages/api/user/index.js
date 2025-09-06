import dbConnect from '../../../utils/dbConnect'
import User from '../../../models/User'
import { getSession } from '../auth'

export default async function handler(req, res) {
  const session = await getSession(req, res)
  const { method } = req
  if (!session) {
    res.status(401).json({})
    return
  }
  await dbConnect()

  try {
    const users = await User.find({ email: session.user.email })
    let user
    if (method === 'PUT') {
      // MIGRATION NOTE: Mongoose 6+ - findByIdAndUpdate() works the same way
      // update user in database
      user = await User.findByIdAndUpdate(users[0]._id, req.body, {
        new: true,
        runValidators: true,
      })
    }
    if (method === 'GET') {
      // user in database, return it
      if (users && users.length > 0) {
        user = users[0]
      }
      // user not in database, create new user
      else {
        // MIGRATION NOTE: Mongoose 6+ - create() works the same way
        user = await User.create({ email: session.user.email, name: '', sub: session.user.sub })
      }
    }

    if (!user) {
      return res.status(400).json({ success: false })
    }
    // no email
    const filteredUser = { id: user.id, name: user.name }
    res.status(200).json({ success: true, data: filteredUser })
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false })
  }
}
