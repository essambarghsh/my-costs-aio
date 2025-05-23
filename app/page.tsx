'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './contexts/LanguageContext';

interface SubItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'paid' | 'unpaid';
}

interface Group {
  id: string;
  name: string;
  category: 'maintenance' | 'home' | 'other';
  items: SubItem[];
  createdDate: string;
}

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [groups, setGroups] = useState<Group[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingSubItem, setEditingSubItem] = useState<{ group: Group; item: SubItem } | null>(null);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showSubItemForm, setShowSubItemForm] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  const [groupFormData, setGroupFormData] = useState({
    name: '',
    category: 'maintenance' as 'maintenance' | 'home' | 'other',
  });

  const [subItemFormData, setSubItemFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'unpaid' as 'paid' | 'unpaid',
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups');
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
        // Expand all groups by default
        setExpandedGroups(new Set(data.map((g: Group) => g.id)));
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = editingGroup ? 'PUT' : 'POST';
    const body = editingGroup 
      ? { ...groupFormData, id: editingGroup.id }
      : groupFormData;

    try {
      const response = await fetch('/api/groups', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchGroups();
        resetGroupForm();
      }
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };

  const handleSubItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const groupId = showSubItemForm || editingSubItem?.group.id;
    if (!groupId) return;

    const method = editingSubItem ? 'PUT' : 'POST';
    const body = editingSubItem 
      ? { ...subItemFormData, id: editingSubItem.item.id, groupId }
      : { ...subItemFormData, groupId };

    try {
      const response = await fetch('/api/groups/items', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchGroups();
        resetSubItemForm();
      }
    } catch (error) {
      console.error('Error saving sub-item:', error);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (confirm(t('expense.delete') + '?')) {
      try {
        const response = await fetch(`/api/groups?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchGroups();
        }
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  const handleDeleteSubItem = async (groupId: string, itemId: string) => {
    if (confirm(t('expense.delete') + '?')) {
      try {
        const response = await fetch(`/api/groups/items?groupId=${groupId}&itemId=${itemId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchGroups();
        }
      } catch (error) {
        console.error('Error deleting sub-item:', error);
      }
    }
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setGroupFormData({
      name: group.name,
      category: group.category,
    });
    setShowGroupForm(true);
  };

  const handleEditSubItem = (group: Group, item: SubItem) => {
    setEditingSubItem({ group, item });
    setSubItemFormData({
      description: item.description,
      amount: item.amount.toString(),
      date: item.date,
      status: item.status,
    });
    setShowSubItemForm(group.id);
  };

  const resetGroupForm = () => {
    setGroupFormData({
      name: '',
      category: 'maintenance',
    });
    setEditingGroup(null);
    setShowGroupForm(false);
  };

  const resetSubItemForm = () => {
    setSubItemFormData({
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      status: 'unpaid',
    });
    setEditingSubItem(null);
    setShowSubItemForm(null);
  };

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
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

  const getCategoryIcon = (category: 'maintenance' | 'home' | 'other') => {
    switch (category) {
      case 'maintenance': return '🔧';
      case 'home': return '🏠';
      case 'other': return '📋';
      default: return '📋';
    }
  };

  const getGroupTotal = (group: Group) => {
    return group.items.reduce((total, item) => total + item.amount, 0);
  };

  const getGroupPaidTotal = (group: Group) => {
    return group.items.filter(item => item.status === 'paid').reduce((total, item) => total + item.amount, 0);
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
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('app.title')}</h1>
          <button
            onClick={() => setShowSettings(true)}
            className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg transition-colors"
          >
            {t('app.settings')}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Add Group Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowGroupForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            + {t('group.add')}
          </button>
        </div>

        {/* Groups */}
        {groups.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-gray-500 text-lg">{t('group.no_groups')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => {
              const total = getGroupTotal(group);
              const paidTotal = getGroupPaidTotal(group);
              const isExpanded = expandedGroups.has(group.id);
              
              return (
                <div
                  key={group.id}
                  className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden"
                >
                  {/* Group Header */}
                  <div 
                    className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 cursor-pointer hover:from-green-100 hover:to-green-150 transition-all"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{getCategoryIcon(group.category)}</span>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{group.name}</h2>
                          <p className="text-sm text-green-600 font-medium">
                            {getCategoryLabel(group.category)} • {group.items.length} {t('group.items_count')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600">
                            {total.toLocaleString()} EGP
                          </div>
                          <div className="text-sm text-gray-600">
                            {t('group.paid_total')}: {paidTotal.toLocaleString()} EGP
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditGroup(group);
                            }}
                            className="text-green-600 hover:text-green-800 font-medium text-sm px-2 py-1 rounded"
                          >
                            {t('expense.edit_btn')}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGroup(group.id);
                            }}
                            className="text-red-600 hover:text-red-800 font-medium text-sm px-2 py-1 rounded"
                          >
                            {t('expense.delete')}
                          </button>
                          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            ⬇️
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Group Content */}
                  {isExpanded && (
                    <div className="p-6">
                      {/* Add Sub-item Button */}
                      <div className="mb-4">
                        <button
                          onClick={() => setShowSubItemForm(group.id)}
                          className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                          + {t('item.add')}
                        </button>
                      </div>

                      {/* Sub-items */}
                      {group.items.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          {t('group.no_items')}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.items.map((item) => (
                            <div
                              key={item.id}
                              className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-900 text-sm">{item.description}</h4>
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    item.status === 'paid'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {getStatusLabel(item.status)}
                                </span>
                              </div>
                              
                              <div className="mb-3">
                                <div className="text-xl font-bold text-green-600">
                                  {item.amount.toLocaleString()} EGP
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(item.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditSubItem(group, item)}
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-xs font-medium transition-colors"
                                >
                                  {t('expense.edit_btn')}
                                </button>
                                <button
                                  onClick={() => handleDeleteSubItem(group.id, item.id)}
                                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs font-medium transition-colors"
                                >
                                  {t('expense.delete')}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Group Form Modal */}
      {showGroupForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 w-full">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              {editingGroup ? t('group.edit') : t('group.add')}
            </h2>
            
            <form onSubmit={handleGroupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('group.name')}
                </label>
                <input
                  type="text"
                  required
                  value={groupFormData.name}
                  onChange={(e) => setGroupFormData({...groupFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('form.placeholder.group_name')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('expense.category')}
                </label>
                <select
                  value={groupFormData.category}
                  onChange={(e) => setGroupFormData({...groupFormData, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="maintenance">{t('category.maintenance')}</option>
                  <option value="home">{t('category.home')}</option>
                  <option value="other">{t('category.other')}</option>
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
                  onClick={resetGroupForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {t('expense.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-item Form Modal */}
      {showSubItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 w-full">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              {editingSubItem ? t('item.edit') : t('item.add')}
            </h2>
            
            <form onSubmit={handleSubItemSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('expense.description')}
                </label>
                <input
                  type="text"
                  required
                  value={subItemFormData.description}
                  onChange={(e) => setSubItemFormData({...subItemFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
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
                  value={subItemFormData.amount}
                  onChange={(e) => setSubItemFormData({...subItemFormData, amount: e.target.value})}
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
                  value={subItemFormData.date}
                  onChange={(e) => setSubItemFormData({...subItemFormData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('expense.status')}
                </label>
                <select
                  value={subItemFormData.status}
                  onChange={(e) => setSubItemFormData({...subItemFormData, status: e.target.value as any})}
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
                  onClick={resetSubItemForm}
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