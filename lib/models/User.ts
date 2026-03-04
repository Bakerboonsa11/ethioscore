import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  username: string;
  name?: string;
  password: string;
  role: 'super-admin' | 'org-admin' | 'league-admin' | 'club-admin' | 'event-admin' | 'referee';
  phone?: string;
  organization?: mongoose.Types.ObjectId;
  league?: mongoose.Types.ObjectId;
  team?: mongoose.Types.ObjectId; // For club-admin users
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['super-admin', 'org-admin', 'league-admin', 'club-admin', 'event-admin', 'referee'], default: 'org-admin' },
  phone: { type: String },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  league: { type: mongoose.Schema.Types.ObjectId, ref: 'League' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }, // For club-admin users
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Force re-registration to apply schema changes
delete mongoose.models.User;

export default mongoose.model<IUser>('User', UserSchema);
