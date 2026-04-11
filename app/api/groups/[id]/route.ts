import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Group from '@/lib/models/Group';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { name, teams } = await request.json();
    const groupId = params.id;

    if (!name || !teams) {
      return NextResponse.json({ error: 'Name and teams are required' }, { status: 400 });
    }

    const group = await Group.findByIdAndUpdate(
      groupId,
      { name, teams },
      { new: true, runValidators: true }
    );

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error('Error updating group:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const groupId = params.id;

    const group = await Group.findByIdAndDelete(groupId);

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
