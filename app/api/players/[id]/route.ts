import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Player from '@/lib/models/Player';
import Team from '@/lib/models/Team';

// GET /api/players/[id] - Get a specific player
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const player = await Player.findById(params.id).populate('team', 'name');

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(player);
  } catch (error: any) {
    console.error('Error fetching player:', error);
    return NextResponse.json({ error: 'Failed to fetch player' }, { status: 500 });
  }
}

// PUT /api/players/[id] - Update a player
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      joinedDate,
      contractEnd,
      status,
      goals,
      assists,
      appearances,
      height,
      weight,
      preferredFoot,
      placeOfBirth,
      address,
      emergencyContact
    } = data;

    // Check if player exists
    const existingPlayer = await Player.findById(params.id);
    if (!existingPlayer) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Check if team exists (if team is being updated)
    if (team) {
      const teamExists = await Team.findById(team);
      if (!teamExists) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      }
    }

    // Calculate age if date of birth is provided
    let age = existingPlayer.age;
    if (dateOfBirth) {
      age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    }

    // Update player
    const updatedPlayer = await Player.findByIdAndUpdate(
      params.id,
      {
        ...(name && { name }),
        ...(position && { position }),
        ...(jerseyNumber && { jerseyNumber }),
        ...(dateOfBirth && { dateOfBirth, age }),
        ...(nationality && { nationality }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(team && { team }),
        ...(joinedDate && { joinedDate }),
        ...(contractEnd && { contractEnd }),
        ...(status && { status }),
        ...(goals !== undefined && { goals }),
        ...(assists !== undefined && { assists }),
        ...(appearances !== undefined && { appearances }),
        ...(height !== undefined && { height }),
        ...(weight !== undefined && { weight }),
        ...(preferredFoot && { preferredFoot }),
        ...(placeOfBirth !== undefined && { placeOfBirth }),
        ...(address !== undefined && { address }),
        ...(emergencyContact && { emergencyContact })
      },
      { new: true }
    ).populate('team', 'name');

    return NextResponse.json(updatedPlayer);
  } catch (error: any) {
    console.error('Error updating player:', error);

    // Handle duplicate jersey number error
    if (error.code === 11000) {
      return NextResponse.json({
        error: 'A player with this jersey number already exists in the team'
      }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to update player' }, { status: 500 });
  }
}

// DELETE /api/players/[id] - Delete a player
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const player = await Player.findByIdAndDelete(params.id);

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting player:', error);
    return NextResponse.json({ error: 'Failed to delete player' }, { status: 500 });
  }
}
