import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/lib/models/User';
import Organization from '@/lib/models/Organization';

// Force League model registration
const League = require('@/lib/models/League').default;

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // For org-admin users, check organization approval status
    if (user.role === 'org-admin') {
      if (!user.organization) {
        return NextResponse.json({
          error: 'Organization not found. Please contact support.',
          requiresApproval: true
        }, { status: 403 });
      }

      const organization = await Organization.findById(user.organization);
      if (!organization) {
        return NextResponse.json({
          error: 'Organization not found. Please contact support.',
          requiresApproval: true
        }, { status: 403 });
      }

      if (organization.status !== 'approved') {
        return NextResponse.json({
          error: 'Your organization is still under review. You will be notified once approved.',
          organizationStatus: organization.status,
          requiresApproval: true
        }, { status: 403 });
      }
    }

    // Return user without password
    const populatedUser = await User.findById(user._id)
      .populate('organization', 'name')
      .populate('league', 'name');

    const { password: _, ...userWithoutPassword } = populatedUser.toObject();

    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
