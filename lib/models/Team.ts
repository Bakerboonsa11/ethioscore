import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  logo?: string;
  founded: number;
  location: string;
  stadium?: string;
  manager?: string;
  website?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  league: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  clubAdmin?: mongoose.Types.ObjectId;
  status: 'active' | 'inactive' | 'suspended';
  playersCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  logo: {
    type: String,
    trim: true
  },

  founded: {
    type: Number,
    required: true,
    min: 1800,
    max: new Date().getFullYear()
  },

  location: {
    type: String,
    required: true,
    trim: true
  },

  stadium: {
    type: String,
    trim: true
  },

  manager: {
    type: String,
    trim: true
  },

  website: {
    type: String,
    trim: true,
    match: /^https?:\/\/.+/
  },

  colors: {
    primary: {
      type: String,
      trim: true,
      default: '#1e40af'
    },
    secondary: {
      type: String,
      trim: true,
      default: '#ffffff'
    }
  },

  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String
  },

  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true,
    index: true
  },

  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },

  clubAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    index: true
  },

  playersCount: {
    type: Number,
    default: 0,
    min: 0
  }

}, { timestamps: true });

// Indexes for efficient queries
teamSchema.index({ league: 1, name: 1 }, { unique: true });
teamSchema.index({ organization: 1 });

// Force re-registration to apply schema changes
delete mongoose.models.Team;

export default mongoose.model<ITeam>('Team', teamSchema);
