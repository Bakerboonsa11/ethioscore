import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Player from '@/lib/models/Player';
import Team from '@/lib/models/Team';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const organizationId = searchParams.get('organizationId');

    let query = {};
    if (teamId) {
      query = { team: teamId };
    } else if (organizationId) {
      query = { organization: organizationId };
    }

    const players = await Player.find(query)
      .populate('team', 'name')
      .populate('organization', 'name')
      .populate('league', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(players);
  } catch (error: any) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}

// POST /api/players - Create a new player
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const data = await request.json();
    const {
      name,
      position,
      jerseyNumber,
      dateOfBirth,
      nationality,
      email,
      phone,
      team,
      organization,
      league,
      joinedDate,
      contractEnd,
      height,
      weight,
      preferredFoot,
      placeOfBirth,
      address,
      emergencyContact
    } = data;

    // Validate required fields
    if (!name || !position || !jerseyNumber || !dateOfBirth || !nationality || !email || !phone || !team || !organization || !league || !joinedDate || !contractEnd) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if team exists
    const teamExists = await Team.findById(team);
    if (!teamExists) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Calculate age from date of birth
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();

    // Create player
    const player = new Player({
      name,
      position,
      jerseyNumber,
      age,
      dateOfBirth,
      nationality,
      email,
      phone,
      team,
      organization,
      league,
      joinedDate,
      contractEnd,
      height,
      weight,
      preferredFoot,
      placeOfBirth,
      address,
      emergencyContact,
      status: 'active',
      goals: 0,
      assists: 0,
      appearances: 0
    });

    await player.save();

    // Populate team info before returning
    await player.populate('team', 'name');

    return NextResponse.json(player, { status: 201 });
  } catch (error: any) {
    console.error('Error creating player:', error);

    // Handle duplicate jersey number error
    if (error.code === 11000) {
      return NextResponse.json({
        error: 'A player with this jersey number already exists in the team'
      }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
  }
}
