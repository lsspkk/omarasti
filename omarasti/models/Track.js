import mongoose from 'mongoose'

const TrackSchema = new mongoose.Schema({
  name: String,
  location: String,
  published: Boolean,
  modified: Date,
  owner: {type : mongoose.Schema.Types.ObjectId, ref: 'User'}, 
  markers: [ 
    {description: String, latlng: {lat: Number, lng: Number}} 
  ]
})

export default mongoose.models?.Track || mongoose.model('Track', TrackSchema)
