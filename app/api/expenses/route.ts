import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export interface Expense {
  id: string;
  description: string;
  category: 'maintenance' | 'home' | 'other';
  amount: number;
  date: string;
  status: 'paid' | 'unpaid';
}

const DATA_FILE = path.join(process.cwd(), 'data', 'expenses.json');

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    // File doesn't exist, create it
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

async function readExpenses(): Promise<Expense[]> {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

async function writeExpenses(expenses: Expense[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(expenses, null, 2));
}

export async function GET() {
  try {
    const expenses = await readExpenses();
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error reading expenses:', error);
    return NextResponse.json({ error: 'Failed to read expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const expenses = await readExpenses();
    
    const newExpense: Expense = {
      id: Date.now().toString(),
      description: body.description,
      category: body.category,
      amount: parseFloat(body.amount),
      date: body.date,
      status: body.status,
    };
    
    expenses.push(newExpense);
    await writeExpenses(expenses);
    
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const expenses = await readExpenses();
    
    const index = expenses.findIndex(exp => exp.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    
    expenses[index] = {
      ...expenses[index],
      description: body.description,
      category: body.category,
      amount: parseFloat(body.amount),
      date: body.date,
      status: body.status,
    };
    
    await writeExpenses(expenses);
    
    return NextResponse.json(expenses[index]);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const expenses = await readExpenses();
    const filteredExpenses = expenses.filter(exp => exp.id !== id);
    
    if (expenses.length === filteredExpenses.length) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    
    await writeExpenses(filteredExpenses);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}