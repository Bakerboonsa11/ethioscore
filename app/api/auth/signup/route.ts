import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import Organization from '@/lib/models/Organization';
import { connectDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting signup API');
    await connectDB();
    console.log('DB connected');

    const { orgName, country, adminName, email, username, phone, password, role } = await request.json();
    console.log('Received data:', { orgName, country, email, username, role });

    if (!email || !username || !password || !orgName || !country) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      } else {
        return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
      }
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
    const userData = {
      email,
      username,
      password,
      role: role || 'org-admin',
      phone,
      organization: organization._id,
    };
    console.log('Creating user with data:', userData);
    
    const user = new User(userData);
    await user.save();
    console.log('User saved:', user.toObject());

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

