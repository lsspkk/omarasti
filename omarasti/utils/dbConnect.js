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
  // MIGRATION NOTE: Mongoose 6+ no longer supports these deprecated options
  // useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex
  // are no longer needed and should be removed (they're now defaults)
  pendingPromise = mongoose.connect(process.env.MONGODB_URI, {
    // These options are no longer supported in Mongoose 6+:
    // useNewUrlParser: true,    // Always true by default
    // useUnifiedTopology: true, // Always true by default
    // useFindAndModify: false,  // Always false by default
    // useCreateIndex: true,     // Always true by default
  })
  try {
    await pendingPromise
  } finally {
    pendingPromise = null
  }
}

export default dbConnect
