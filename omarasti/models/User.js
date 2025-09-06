import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  sub: String, // google account unique id
})

// MIGRATION NOTE: Mongoose 6+ - Using optional chaining (?.) for models check
// This pattern is now preferred: mongoose.models?.User || mongoose.model('User', UserSchema)
export default mongoose.models.User || mongoose.model('User', UserSchema)
