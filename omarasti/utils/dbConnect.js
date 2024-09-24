import mongoose from 'mongoose'

const readyStates = {
  disconnected: 0,
  connected: 1,
  connecting: 2,
  disconnecting: 3,
}

let pendingPromise = null

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return
  }
  if (pendingPromise) {
    await pendingPromise
    return
  }
  pendingPromise = mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  try {
    await pendingPromise
  } finally {
    pendingPromise = null
  }
}

export default dbConnect
