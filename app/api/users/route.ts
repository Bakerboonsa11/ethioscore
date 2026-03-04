import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Organization from '@/lib/models/Organization';
import League from '@/lib/models/League';
import Team from '@/lib/models/Team';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const leagueId = searchParams.get('leagueId');

    let query: any = {};

    if (role) {
      query.role = role;
    }

    if (leagueId) {
      query.league = leagueId;
    }

    const users = await User.find(query).populate('organization', 'name').populate('league', 'name').populate('team', 'name').sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { userId, teamId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (teamId) {
      updateData.team = teamId;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).populate('organization', 'name').populate('league', 'name').populate('team', 'name');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser.toObject();

    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update user',
      details: error.errors 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    let { name, username, email, password, phone, organizationId, leagueId, role = 'referee' } = await request.json();

    console.log('Received data for user creation:', { name, username, email, role, leagueId });

    // Default role to 'referee' if leagueId is provided and no role is specified
    if (leagueId && !role) {
      role = 'referee';
    }

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }

    // For org-admin and club-admin roles, organizationId is required
    if ((role === 'org-admin' || role === 'club-admin') && !organizationId) {
      return NextResponse.json({ error: 'organizationId is required for org-admin and club-admin roles' }, { status: 400 });
    }

    // For league-admin, event-admin, and referee roles, leagueId is required
    if ((role === 'league-admin' || role === 'event-admin' || role === 'referee') && !leagueId) {
      return NextResponse.json({ error: 'leagueId is required for league-admin, event-admin, and referee roles' }, { status: 400 });
    }

    // For event-admin role, no restriction on multiple admins per league

    // For org-admin and club-admin roles, check if organization exists
    if (role === 'org-admin' || role === 'club-admin') {
      const organization = await Organization.findById(organizationId);
      if (!organization) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      }
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      } else {
        return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
      }
    }

    // Create new user
    const userData: any = {
      email,
      username,
      name,
      password, // Don't hash here, let pre-save hook handle it
      role,
      phone,
    };

    if (role === 'org-admin' || role === 'club-admin') {
      userData.organization = organizationId;
    } else if (role === 'league-admin' || role === 'event-admin' || role === 'referee') {
      userData.league = leagueId;
    }

    const newUser = new User(userData);

    await newUser.save();

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    console.error('Error details:', error.errors);
    return NextResponse.json({ 
      error: error.message || 'Failed to create user',
      details: error.errors 
    }, { status: 500 });
  }
}
