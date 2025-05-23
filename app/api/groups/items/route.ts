import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { Group, SubItem } from '../route';

const DATA_FILE = path.join(process.cwd(), 'data', 'groups.json');

async function readGroups(): Promise<Group[]> {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

async function writeGroups(groups: Group[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(groups, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const groups = await readGroups();
    
    const groupIndex = groups.findIndex(group => group.id === body.groupId);
    if (groupIndex === -1) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    const newSubItem: SubItem = {
      id: Date.now().toString(),
      description: body.description,
      amount: parseFloat(body.amount),
      date: body.date,
      status: body.status,
    };
    
    groups[groupIndex].items.push(newSubItem);
    await writeGroups(groups);
    
    return NextResponse.json(newSubItem, { status: 201 });
  } catch (error) {
    console.error('Error creating sub-item:', error);
    return NextResponse.json({ error: 'Failed to create sub-item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const groups = await readGroups();
    
    const groupIndex = groups.findIndex(group => group.id === body.groupId);
    if (groupIndex === -1) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    const itemIndex = groups[groupIndex].items.findIndex(item => item.id === body.id);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Sub-item not found' }, { status: 404 });
    }
    
    groups[groupIndex].items[itemIndex] = {
      ...groups[groupIndex].items[itemIndex],
      description: body.description,
      amount: parseFloat(body.amount),
      date: body.date,
      status: body.status,
    };
    
    await writeGroups(groups);
    
    return NextResponse.json(groups[groupIndex].items[itemIndex]);
  } catch (error) {
    console.error('Error updating sub-item:', error);
    return NextResponse.json({ error: 'Failed to update sub-item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    const itemId = searchParams.get('itemId');
    
    if (!groupId || !itemId) {
      return NextResponse.json({ error: 'Group ID and Item ID are required' }, { status: 400 });
    }
    
    const groups = await readGroups();
    
    const groupIndex = groups.findIndex(group => group.id === groupId);
    if (groupIndex === -1) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    const originalLength = groups[groupIndex].items.length;
    groups[groupIndex].items = groups[groupIndex].items.filter(item => item.id !== itemId);
    
    if (groups[groupIndex].items.length === originalLength) {
      return NextResponse.json({ error: 'Sub-item not found' }, { status: 404 });
    }
    
    await writeGroups(groups);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sub-item:', error);
    return NextResponse.json({ error: 'Failed to delete sub-item' }, { status: 500 });
  }
}