import mongoose, { Schema, Model, HydratedDocument } from 'mongoose'
import type { User } from './User'
import type { Track } from './Track'

export interface Run {
  runner: mongoose.Types.ObjectId | User
  track: mongoose.Types.ObjectId | Track
  totalTime: number
  start: Date
  end: Date
  route: { timestamp: number; latlng: { lat: number; lng: number } }[]
  markerTimes: Date[]
}

export type RunDoc = HydratedDocument<Run>

export type Populated<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: Exclude<T[P], mongoose.Types.ObjectId>
}

export type PopulatedRun = Populated<Run, 'runner' | 'track'> & {
  _id: string
}

const RunSchema = new Schema<Run>({
  runner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  track: { type: Schema.Types.ObjectId, ref: 'Track', required: true },
  totalTime: { type: Number, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  route: [
    {
      timestamp: Number,
      latlng: {
        lat: Number,
        lng: Number,
      },
    },
  ],
  markerTimes: [Date],
})

export const RunModel: Model<Run> = mongoose.models.Run || mongoose.model<Run>('Run', RunSchema)

export default RunModel
