import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  country: string;
  address?: string;
  phone?: string;
  status: 'pending' | 'approved';
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema: Schema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
}, {
  timestamps: true,
});

// Force re-registration to apply schema changes
delete mongoose.models.Organization;

export default mongoose.model<IOrganization>('Organization', OrganizationSchema);
