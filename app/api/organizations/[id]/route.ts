import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Organization from '@/lib/models/Organization';
import User from '@/lib/models/User';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const updates = await request.json();

    const organization = await Organization.findByIdAndUpdate(id, updates, { new: true });
    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json(organization);
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

    // Delete organization
    const organization = await Organization.findByIdAndDelete(id);
    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Remove organization reference from users
    await User.updateMany({ organization: id }, { $unset: { organization: 1 } });

    return NextResponse.json({ message: 'Organization deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
