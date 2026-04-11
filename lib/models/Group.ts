import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  teams: string[]; // Array of team IDs
  leagueId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  teams: [{
    type: String,
    required: true
  }],

  leagueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "League",
    required: true
  }
}, { timestamps: true });

groupSchema.index({ leagueId: 1 });

export default mongoose.models.Group || mongoose.model<IGroup>('Group', groupSchema);
