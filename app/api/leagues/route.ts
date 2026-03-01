import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import League from '@/lib/models/League';
import Organization from '@/lib/models/Organization';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organization');
    const status = searchParams.get('status');
    const year = searchParams.get('year');

    let query: any = {};

    if (organizationId) {
      query.organization = organizationId;
    }

    if (status) {
      query.status = status;
    }

    if (year) {
      query.year = parseInt(year);
    }

    const leagues = await League.find(query)
      .populate('organization', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(leagues, { status: 200 });
  } catch (error) {
    console.error('Error fetching leagues:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      name,
      logo,
      year,
      region,
      socialMedia,
      organization,
      tier,
      type,
      status = 'draft'
    } = body;

    // Validate required fields
    if (!name || !year || !organization || !type?.format) {
      return NextResponse.json(
        { error: 'Missing required fields: name, year, organization, type.format' },
        { status: 400 }
      );
    }

    // Validate organization exists
    const orgExists = await Organization.findById(organization);
    if (!orgExists) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Validate competition format
    const validFormats = ['league', 'knockout', 'group_stage'];
    if (!validFormats.includes(type.format)) {
      return NextResponse.json(
        { error: 'Invalid competition format. Must be: league, knockout, or group_stage' },
        { status: 400 }
      );
    }

    // Create league
    const league = new League({
      name,
      logo,
      year,
      region,
      socialMedia,
      organization,
      tier,
      type: {
        format: type.format,
        hasHomeAway: type.hasHomeAway !== undefined ? type.hasHomeAway : true,
        groupCount: type.format === 'group_stage' ? type.groupCount : undefined,
        knockoutRounds: type.format === 'knockout' ? type.knockoutRounds : undefined
      },
      status
    });

    const savedLeague = await league.save();

    // Populate organization details
    await savedLeague.populate('organization', 'name');

    return NextResponse.json(savedLeague, { status: 201 });
  } catch (error) {
    console.error('Error creating league:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
