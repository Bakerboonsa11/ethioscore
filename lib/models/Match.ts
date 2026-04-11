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
  referee?: mongoose.Types.ObjectId; // Head Referee ID
  assistantReferee1?: mongoose.Types.ObjectId; // Assistant Referee 1 ID
  assistantReferee2?: mongoose.Types.ObjectId; // Assistant Referee 2 ID
  eventAdmin?: mongoose.Types.ObjectId; // Event Admin ID
  group?: string; // Group identifier for group stage matches
  roundName?: string; // Round name for tournament matches
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
  },

  referee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }, // Head Referee ID
  assistantReferee1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }, // Assistant Referee 1 ID
  assistantReferee2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }, // Assistant Referee 2 ID
  eventAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }, // Event Admin ID

  group: String, // Group identifier for group stage matches

  roundName: String, // Round name for tournament matches
}, {
  timestamps: true
});

const Match = mongoose.models.Match || mongoose.model<IMatch>('Match', matchSchema);

export default Match;
