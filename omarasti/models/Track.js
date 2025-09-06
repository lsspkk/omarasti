import mongoose from 'mongoose'

const TrackSchema = new mongoose.Schema({
  name: String,
  location: String,
  shortId: String,
  published: Boolean,
  modified: Date,
  // MIGRATION NOTE: Mongoose 6+ - ObjectId references work the same way
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  markers: [{ description: String, latlng: { lat: Number, lng: Number } }],
})

// MIGRATION NOTE: Using optional chaining - recommended pattern for Mongoose 6+
export default mongoose.models?.Track || mongoose.model('Track', TrackSchema)
