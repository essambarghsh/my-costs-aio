'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './contexts/LanguageContext';

interface Expense {
  id: string;
  description: string;
  category: 'maintenance' | 'home' | 'other';
  amount: number;
  date: string;
  status: 'paid' | 'unpaid';
}

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    description: '',
    category: 'maintenance' as 'maintenance' | 'home' | 'other',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'unpaid' as 'paid' | 'unpaid',
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = editingExpense ? 'PUT' : 'POST';
    const body = editingExpense 
      ? { ...formData, id: editingExpense.id }
      : formData;

    try {
      const response = await fetch('/api/expenses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchExpenses();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('expense.delete') + '?')) {
      try {
        const response = await fetch(`/api/expenses?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchExpenses();
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date,
      status: expense.status,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      description: '',
      category: 'maintenance',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      status: 'unpaid',
    });
    setEditingExpense(null);
    setShowForm(false);
  };

  const getCategoryLabel = (category: 'maintenance' | 'home' | 'other') => {
    const categoryKeys = {
      maintenance: 'category.maintenance' as const,
      home: 'category.home' as const,
      other: 'category.other' as const,
    };
    return t(categoryKeys[category]);
  };

  const getStatusLabel = (status: 'paid' | 'unpaid') => {
    const statusKeys = {
      paid: 'status.paid' as const,
      unpaid: 'status.unpaid' as const,
    };
    return t(statusKeys[status]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-green-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('app.title')}</h1>
          <button
            onClick={() => setShowSettings(true)}
            className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg transition-colors"
          >
            {t('app.settings')}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            + {t('expense.add')}
          </button>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-green-800">
                    {t('table.description')}
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-green-800">
                    {t('table.category')}
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-green-800">
                    {t('table.amount')}
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-green-800">
                    {t('table.date')}
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-green-800">
                    {t('table.status')}
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-green-800">
                    {t('table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      {t('message.no_expenses')}
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-green-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {getCategoryLabel(expense.category)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        {expense.amount.toLocaleString()} EGP
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(expense.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            expense.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {getStatusLabel(expense.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          {t('expense.edit_btn')}
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          {t('expense.delete')}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 w-full">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              {editingExpense ? t('expense.edit') : t('expense.add')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('expense.description')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('expense.category')}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="maintenance">{t('category.maintenance')}</option>
                  <option value="home">{t('category.home')}</option>
                  <option value="other">{t('category.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('expense.amount')}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('expense.date')}
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('expense.status')}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="unpaid">{t('status.unpaid')}</option>
                  <option value="paid">{t('status.paid')}</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {t('expense.save')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {t('expense.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 w-full">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              {t('app.settings')}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('app.language')}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'ar' | 'en')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                {t('app.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}