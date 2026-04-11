import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Group from '@/lib/models/Group';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get('leagueId');

    if (!leagueId) {
      return NextResponse.json({ error: 'League ID is required' }, { status: 400 });
    }

    const groups = await Group.find({ leagueId }).sort({ name: 1 });

    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, teams, leagueId } = await request.json();

    if (!name || !teams || !leagueId) {
      return NextResponse.json({ error: 'Name, teams, and leagueId are required' }, { status: 400 });
    }

    // Check if group name already exists for this league
    const existingGroup = await Group.findOne({ name, leagueId });
    if (existingGroup) {
      return NextResponse.json({ error: 'Group name already exists for this league' }, { status: 400 });
    }

    const group = new Group({
      name,
      teams,
      leagueId
    });

    await group.save();

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
