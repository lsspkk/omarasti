import mongoose from 'mongoose'

const RunSchema = new mongoose.Schema({
  // MIGRATION NOTE: ObjectId references work the same way in Mongoose 6+
  runner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  track: { type: mongoose.Schema.Types.ObjectId, ref: 'Track' },
  totalTime: Number,
  start: Date,
  end: Date,
  route: [{ timestamp: Number, latlng: { lat: Number, lng: Number } }],
  markerTimes: [Date],
})

// MIGRATION NOTE: Using optional chaining - recommended pattern for Mongoose 6+
export default mongoose.models?.Run || mongoose.model('Run', RunSchema)
