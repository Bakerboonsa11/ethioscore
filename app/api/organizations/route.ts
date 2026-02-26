import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Organization from '@/lib/models/Organization';

export async function GET() {
  try {
    await connectDB();
    const organizations = await Organization.find().sort({ createdAt: -1 });
    console.log('Fetched organizations:', organizations.map(org => ({ name: org.name, status: org.status })));
    return NextResponse.json(organizations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, country, address, phone } = await request.json();
    const organization = new Organization({ name, country, address, phone });
    await organization.save();
    return NextResponse.json(organization, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
