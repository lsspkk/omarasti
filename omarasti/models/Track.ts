import mongoose, { Schema, Document, Model } from 'mongoose'
import { User } from './User'

export interface Track {
  name: string
  location: string
  shortId: string
  published: boolean
  modified: Date
  owner: mongoose.Types.ObjectId
  markers: { description: string; latlng: { lat: number; lng: number } }[]
  _id?: string
  id?: string
}

export interface TrackPopulatedType extends Omit<Track, 'owner'> {
  owner?: User
}

// Type for tracks returned by Track.find().populate('owner', '-email -__v').select('-markers._id -markers.latlng._id')
export interface TrackListType extends Omit<Track, 'owner'> {
  owner?: Omit<User, 'email' | '__v'>
  markers: { description: string; latlng: { lat: number; lng: number } }[] // without _id fields
}

export type TrackType = Track & Document

const TrackSchema = new Schema<TrackType>({
  name: { type: String, required: true },
  location: String,
  shortId: String,
  published: Boolean,
  modified: Date,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  markers: [
    {
      description: String,
      latlng: { lat: Number, lng: Number },
    },
  ],
})

const TrackModel: Model<TrackType> = mongoose.models.Track || mongoose.model<TrackType>('Track', TrackSchema)

export default TrackModel
