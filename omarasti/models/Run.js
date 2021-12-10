import mongoose from 'mongoose'

const RunSchema = new mongoose.Schema({
  runner: {type : mongoose.Schema.Types.ObjectId, ref: 'User'}, 
  track: {type : mongoose.Schema.Types.ObjectId, ref: 'Track'}, 
  totalTime: Number,
  start: Date, 
  end: Date,
  route: [ 
    {timestamp: Number, latlng: {lat: Number, lng: Number}} 
  ],
  markerTimes: [ Date ]
})

export default mongoose.models?.Run || mongoose.model('Run', RunSchema)
