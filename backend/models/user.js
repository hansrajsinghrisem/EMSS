import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fname:      { type: String, required: true },
  lname:      { type: String, required: false },
  email:      { type: String, required: true, unique: true },
  oauthEmail: { type: String, sparse: true }, // Store the OAuth email separately
  phone:      String,
  password:   { type: String, required: true },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
  emailVerified: Date,
  provider:   { type: String, enum: ['credentials', 'google', 'github'], default: 'credentials' },
  isApproved: { type: Boolean, default: false },
  isDeleted:  { type: Boolean, default: false },
  isDenied:   { type: Boolean, default: false },
  createdAt:  { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', userSchema);