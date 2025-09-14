import mongoose, { Schema, Model, HydratedDocument } from 'mongoose'

export interface User {
  name: string
  email: string
  sub: string
  id?: string
  _id?: string
}

export type UserDoc = HydratedDocument<User>

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  sub: { type: String, required: true },
})

const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', UserSchema)

export default UserModel
