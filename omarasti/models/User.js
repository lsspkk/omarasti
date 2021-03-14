import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  sub: String // google account unique id
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
