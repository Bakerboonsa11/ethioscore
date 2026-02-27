import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import Organization from '@/lib/models/Organization';
import { connectDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting signup API');
    await connectDB();
    console.log('DB connected');

    const { orgName, country, adminName, email, phone, password, role } = await request.json();
    console.log('Received data:', { orgName, country, email, role });

    if (!email || !password || !orgName || !country) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create organization
    const organization = new Organization({
      name: orgName,
      country,
      status: 'pending',
    });
    await organization.save();
    console.log('Organization saved:', organization);

    // Create user linked to organization
    const user = new User({
      email,
      password,
      role: role || 'org-admin',
      phone,
      organization: organization._id,
    });
    await user.save();
    console.log('User saved');

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({ 
      message: 'User and organization created successfully',
      user: userWithoutPassword
    }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error.message);
    console.error('Full error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

