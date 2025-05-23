import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export interface SubItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'paid' | 'unpaid';
}

export interface Group {
  id: string;
  name: string;
  category: 'maintenance' | 'home' | 'other';
  items: SubItem[];
  createdDate: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'groups.json');

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    // File doesn't exist, create it
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

async function readGroups(): Promise<Group[]> {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

async function writeGroups(groups: Group[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(groups, null, 2));
}

export async function GET() {
  try {
    const groups = await readGroups();
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error reading groups:', error);
    return NextResponse.json({ error: 'Failed to read groups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const groups = await readGroups();
    
    const newGroup: Group = {
      id: Date.now().toString(),
      name: body.name,
      category: body.category,
      items: [],
      createdDate: new Date().toISOString(),
    };
    
    groups.push(newGroup);
    await writeGroups(groups);
    
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const groups = await readGroups();
    
    const index = groups.findIndex(group => group.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    groups[index] = {
      ...groups[index],
      name: body.name,
      category: body.category,
    };
    
    await writeGroups(groups);
    
    return NextResponse.json(groups[index]);
  } catch (error) {
    console.error('Error updating group:', error);
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const groups = await readGroups();
    const filteredGroups = groups.filter(group => group.id !== id);
    
    if (groups.length === filteredGroups.length) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    await writeGroups(filteredGroups);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
  }
}