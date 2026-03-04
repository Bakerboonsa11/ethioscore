import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Team from '@/lib/models/Team';
import League from '@/lib/models/League';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get('leagueId');
    const organizationId = searchParams.get('organizationId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query: any = {};

    if (leagueId) {
      query.league = leagueId;
    }

    if (organizationId) {
      query.organization = organizationId;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { manager: { $regex: search, $options: 'i' } },
        { stadium: { $regex: search, $options: 'i' } }
      ];
    }

    const teams = await Team.find(query)
      .populate('league', 'name')
      .populate('organization', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(teams);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, logo, founded, location, stadium, manager, website, colors, socialMedia, leagueId, organizationId, status = 'active' } = await request.json();

    if (!name || !founded || !location || !leagueId || !organizationId) {
      return NextResponse.json({
        error: 'Name, founded year, location, leagueId, and organizationId are required'
      }, { status: 400 });
    }

    // Check if league exists and get its constraints
    const league = await League.findById(leagueId);
    if (!league) {
      return NextResponse.json({ error: 'League not found' }, { status: 404 });
    }

    // Check if team name already exists in this league
    const existingTeam = await Team.findOne({ name, league: leagueId });
    if (existingTeam) {
      return NextResponse.json({
        error: 'A team with this name already exists in this league'
      }, { status: 400 });
    }

    // For league format, check max teams constraint
    if (league.type.format === 'league') {
      const teamsCount = await Team.countDocuments({ league: leagueId, status: 'active' });
      const maxTeams = league.type.format === 'league' ? 20 : // Typical league max
                      league.type.format === 'group_stage' ? (league.type.groupCount || 4) * 4 :
                      league.type.knockoutRounds ? Math.pow(2, league.type.knockoutRounds) : 16;

      if (teamsCount >= maxTeams) {
        return NextResponse.json({
          error: `This league can only have a maximum of ${maxTeams} teams`
        }, { status: 400 });
      }
    }

    // Create new team
    const teamData: any = {
      name,
      logo,
      founded,
      location,
      stadium,
      manager,
      website,
      colors: colors || { primary: '#1e40af', secondary: '#ffffff' },
      socialMedia,
      league: leagueId,
      organization: organizationId,
      status
    };

    const newTeam = new Team(teamData);
    await newTeam.save();

    // Populate the response
    const populatedTeam = await Team.findById(newTeam._id)
      .populate('league', 'name')
      .populate('organization', 'name');

    return NextResponse.json(populatedTeam, { status: 201 });
  } catch (error: any) {
    console.error('Error creating team:', error);
    return NextResponse.json({
      error: error.message || 'Failed to create team'
    }, { status: 500 });
  }
}
