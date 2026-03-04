import mongoose, { Document, Schema } from 'mongoose';

export interface IMatch extends Document {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: Date;
  venue?: string;
  leagueId: mongoose.Types.ObjectId;
  status: 'scheduled' | 'live' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const matchSchema: Schema = new mongoose.Schema({
  homeTeam: {
    type: String,
    required: true
  },

  awayTeam: {
    type: String,
    required: true
  },

  homeScore: {
    type: Number,
    required: true,
    default: 0
  },

  awayScore: {
    type: Number,
    required: true,
    default: 0
  },

  date: {
    type: Date,
    required: true
  },

  venue: String,

  leagueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "League",
    required: true
  },

  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed'],
    required: true,
    default: 'scheduled'
  }
}, {
  timestamps: true
});

const Match = mongoose.models.Match || mongoose.model<IMatch>('Match', matchSchema);

export default Match;
