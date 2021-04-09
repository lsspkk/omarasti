import dbConnect from '../../../utils/dbConnect'
import User from '../../../models/User'
import { getSession } from 'next-auth/client'

export default async function handler(req, res) {
  const session = await getSession({ req })
  const {method} = req
  if (!session) {
    res.status(401).json({})
    return
  }
  await dbConnect()

  try {
    const users = await User.find({email: session.user.email})
    let user = undefined
    if (method === 'PUT') {
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
        user = await User.create({email: session.user.email, name: '', sub: session.user.sub })
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