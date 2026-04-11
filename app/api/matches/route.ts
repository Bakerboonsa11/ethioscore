import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Match from '@/lib/models/Match';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get('leagueId');

    let query: any = {};

    if (leagueId) {
      query.leagueId = leagueId;
    }

    const matches = await Match.find(query)
      .populate('leagueId', 'name')
      .populate('referee', 'name username')
      .populate('assistantReferee1', 'name username')
      .populate('assistantReferee2', 'name username')
      .populate('eventAdmin', 'name username')
      .sort({ date: 1 });

    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      date,
      venue,
      leagueId,
      status,
      referee,
      assistantReferee1,
      assistantReferee2,
      eventAdmin
    } = body;

    if (!homeTeam || !awayTeam || !date || !leagueId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const match = new Match({
      homeTeam,
      awayTeam,
      homeScore: homeScore || 0,
      awayScore: awayScore || 0,
      date: new Date(date),
      venue,
      leagueId,
      status: status || 'scheduled',
      referee,
      assistantReferee1,
      assistantReferee2,
      eventAdmin
    });

    await match.save();

    const populatedMatch = await Match.findById(match._id)
      .populate('leagueId', 'name')
      .populate('referee', 'name username')
      .populate('assistantReferee1', 'name username')
      .populate('assistantReferee2', 'name username')
      .populate('eventAdmin', 'name username');

    return NextResponse.json(populatedMatch, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
