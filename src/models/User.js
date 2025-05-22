import mongoose from 'mongoose';

const user = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // do not return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator', 'editor'],
      default: 'user',
      required:false,
    },
    id:{
      type: String,
      required: [true, 'id is required'],
      unique: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
const UserModel = mongoose.models.user || mongoose.model("user",user)
export default UserModel ;

