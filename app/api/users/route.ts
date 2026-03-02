import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Organization from '@/lib/models/Organization';
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

    const users = await User.find(query).populate('organization', 'name').sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, username, email, password, organizationId, leagueId, role = 'org-admin' } = await request.json();

    if (!username || !email || !password || !organizationId) {
      return NextResponse.json({ error: 'Username, email, password, and organizationId are required' }, { status: 400 });
    }

    // For league-admin and event-admin roles, leagueId is required
    if ((role === 'league-admin' || role === 'event-admin') && !leagueId) {
      return NextResponse.json({ error: 'leagueId is required for league-admin and event-admin roles' }, { status: 400 });
    }

    // For league-admin and event-admin roles, check if league already has an admin of that type
    if (role === 'league-admin' || role === 'event-admin') {
      const existingAdmin = await User.findOne({ role, league: leagueId });
      if (existingAdmin) {
        return NextResponse.json({ error: `A ${role.replace('-', ' ')} already exists for this league. You can update or remove the existing admin instead.` }, { status: 400 });
      }
    }

    // Check if organization exists
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
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
    const newUser = new User({
      email,
      username,
      password, // Don't hash here, let pre-save hook handle it
      role,
      organization: organizationId,
      league: (role === 'league-admin' || role === 'event-admin') ? leagueId : undefined,
      phone: '', // optional field
    });

    await newUser.save();

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    console.error('Error details:', error.errors);
    return NextResponse.json({ 
      error: error.message || 'Failed to create user',
      details: error.errors 
    }, { status: 500 });
  }
}
