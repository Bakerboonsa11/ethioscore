import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import League from '@/lib/models/League';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const league = await League.findById(params.id)
      .populate('organization', 'name');

    if (!league) {
      return NextResponse.json({ error: 'League not found' }, { status: 404 });
    }

    return NextResponse.json(league, { status: 200 });
  } catch (error) {
    console.error('Error fetching league:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      name,
      logo,
      year,
      region,
      socialMedia,
      tier,
      type,
      status
    } = body;

    // Validate competition format if provided
    if (type?.format) {
      const validFormats = ['league', 'knockout', 'group_stage'];
      if (!validFormats.includes(type.format)) {
        return NextResponse.json(
          { error: 'Invalid competition format. Must be: league, knockout, or group_stage' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (logo !== undefined) updateData.logo = logo;
    if (year !== undefined) updateData.year = year;
    if (region !== undefined) updateData.region = region;
    if (socialMedia !== undefined) updateData.socialMedia = socialMedia;
    if (tier !== undefined) updateData.tier = tier;
    if (status !== undefined) updateData.status = status;

    if (type) {
      updateData.type = {
        format: type.format,
        hasHomeAway: type.hasHomeAway !== undefined ? type.hasHomeAway : true,
        groupCount: type.format === 'group_stage' ? type.groupCount : undefined,
        knockoutRounds: type.format === 'knockout' ? type.knockoutRounds : undefined
      };
    }

    const league = await League.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('organization', 'name');

    if (!league) {
      return NextResponse.json({ error: 'League not found' }, { status: 404 });
    }

    return NextResponse.json(league, { status: 200 });
  } catch (error) {
    console.error('Error updating league:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const league = await League.findByIdAndDelete(params.id);

    if (!league) {
      return NextResponse.json({ error: 'League not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'League deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting league:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
