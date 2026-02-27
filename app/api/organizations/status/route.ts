import { NextRequest, NextResponse } from 'next/server';
import Organization from '@/lib/models/Organization';
import { connectDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    const organization = await Organization.findById(id);

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: organization._id,
      name: organization.name,
      status: organization.status
    });
  } catch (error: any) {
    console.error('Organization status check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
