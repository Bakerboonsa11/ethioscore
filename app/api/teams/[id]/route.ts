import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Team from '@/lib/models/Team';
import League from '@/lib/models/League';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const team = await Team.findById(id)
      .populate('league', 'name')
      .populate('organization', 'name');

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const updates = await request.json();

    // Validate founded year if provided
    if (updates.founded) {
      const year = updates.founded;
      if (year < 1800 || year > new Date().getFullYear()) {
        return NextResponse.json({
          error: 'Founded year must be between 1800 and current year'
        }, { status: 400 });
      }
    }

    // Check for duplicate name if name is being updated
    if (updates.name) {
      const team = await Team.findById(id);
      if (team) {
        const existingTeam = await Team.findOne({
          name: updates.name,
          league: team.league,
          _id: { $ne: id }
        });
        if (existingTeam) {
          return NextResponse.json({
            error: 'A team with this name already exists in this league'
          }, { status: 400 });
        }
      }
    }

    const team = await Team.findByIdAndUpdate(id, updates, { new: true })
      .populate('league', 'name')
      .populate('organization', 'name');

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const team = await Team.findByIdAndDelete(id);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Team deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
