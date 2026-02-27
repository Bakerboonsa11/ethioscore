import mongoose, { Document, Schema } from 'mongoose';

export interface ILeague extends Document {
  name: string;
  logo?: string;
  year: number;
  region?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  organization: mongoose.Types.ObjectId;
  tier?: number;
  type: {
    format: 'league' | 'knockout' | 'group_stage';
    hasHomeAway: boolean;
    groupCount?: number;
    knockoutRounds?: number;
  };
  status: 'draft' | 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const leagueSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  logo: String,

  year: {
    type: Number,
    required: true,
    index: true
  },

  region: String,

  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String
  },

  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    index: true
  },

  tier: Number,

  // 🔥 Competition Format Object
  type: {
    format: {
      type: String,
      enum: ["league", "knockout", "group_stage"],
      required: true
    },

    hasHomeAway: {
      type: Boolean,
      default: true
    },

    groupCount: {
      type: Number // only used if group_stage
    },

    knockoutRounds: {
      type: Number // only used if knockout
    }
  },

  status: {
    type: String,
    enum: ["draft", "active", "completed"],
    default: "draft",
    index: true
  }

}, { timestamps: true });

leagueSchema.index({ organization: 1, year: 1 });

// Force re-registration to apply schema changes
delete mongoose.models.League;

export default mongoose.model<ILeague>('League', leagueSchema);
