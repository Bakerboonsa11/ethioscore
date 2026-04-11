import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  jerseyNumber: number;
  age: number;
  nationality: string;
  email: string;
  phone: string;
  status: 'active' | 'injured' | 'suspended';
  goals: number;
  assists: number;
  appearances: number;
  joinedDate: string;
  contractEnd: string;
  team: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  league: mongoose.Types.ObjectId;
  height?: number;
  weight?: number;
  preferredFoot?: 'left' | 'right' | 'both';
  dateOfBirth: string;
  placeOfBirth?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema: Schema = new Schema({
  name: { type: String, required: true },
  position: {
    type: String,
    enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
    required: true
  },
  jerseyNumber: { type: Number, required: true, min: 1, max: 99 },
  age: { type: Number, required: true },
  nationality: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'injured', 'suspended'],
    default: 'active'
  },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  appearances: { type: Number, default: 0 },
  joinedDate: { type: String, required: true },
  contractEnd: { type: String, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  league: { type: mongoose.Schema.Types.ObjectId, ref: 'League', required: true },
  height: { type: Number },
  weight: { type: Number },
  preferredFoot: {
    type: String,
    enum: ['left', 'right', 'both']
  },
  dateOfBirth: { type: String, required: true },
  placeOfBirth: { type: String },
  address: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relationship: { type: String }
  }
}, {
  timestamps: true,
});

// Compound index for unique jersey numbers per team
PlayerSchema.index({ team: 1, jerseyNumber: 1 }, { unique: true });

export default mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);
