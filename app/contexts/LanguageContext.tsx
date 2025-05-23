'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

type TranslationKey = 
  | 'app.title' | 'app.settings' | 'app.language' | 'app.close'
  | 'expense.add' | 'expense.edit' | 'expense.description' | 'expense.category' 
  | 'expense.amount' | 'expense.date' | 'expense.status' | 'expense.save' 
  | 'expense.cancel' | 'expense.delete' | 'expense.edit_btn'
  | 'group.add' | 'group.edit' | 'group.name' | 'group.items_count'
  | 'group.total' | 'group.paid_total' | 'group.no_groups' | 'group.no_items'
  | 'item.add' | 'item.edit' | 'item.delete'
  | 'category.maintenance' | 'category.home' | 'category.other'
  | 'status.paid' | 'status.unpaid'
  | 'table.description' | 'table.category' | 'table.amount' | 'table.date' 
  | 'table.status' | 'table.actions'
  | 'message.no_expenses' | 'message.error' | 'message.success'
  | 'form.placeholder.group_name';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const translations: Record<Language, Record<TranslationKey, string>> = {
  ar: {
    // App
    'app.title': 'تطبيق إدارة المصروفات',
    'app.settings': 'الإعدادات',
    'app.language': 'اللغة',
    'app.close': 'إغلاق',
    
    // Expense Form
    'expense.add': 'إضافة مصروف جديد',
    'expense.edit': 'تعديل المصروف',
    'expense.description': 'الوصف',
    'expense.category': 'الفئة',
    'expense.amount': 'المبلغ (جنيه مصري)',
    'expense.date': 'التاريخ',
    'expense.status': 'الحالة',
    'expense.save': 'حفظ',
    'expense.cancel': 'إلغاء',
    'expense.delete': 'حذف',
    'expense.edit_btn': 'تعديل',
    
    // Group
    'group.add': 'إضافة مجموعة جديدة',
    'group.edit': 'تعديل المجموعة',
    'group.name': 'اسم المجموعة',
    'group.items_count': 'عنصر',
    'group.total': 'الإجمالي',
    'group.paid_total': 'المدفوع',
    'group.no_groups': 'لا توجد مجموعات',
    'group.no_items': 'لا توجد عناصر في هذه المجموعة',
    
    // Item
    'item.add': 'إضافة عنصر',
    'item.edit': 'تعديل العنصر',
    'item.delete': 'حذف العنصر',
    
    // Categories
    'category.maintenance': 'أعمال صيانة',
    'category.home': 'منزل',
    'category.other': 'أخرى',
    
    // Status
    'status.paid': 'مدفوع',
    'status.unpaid': 'غير مدفوع',
    
    // Table Headers
    'table.description': 'الوصف',
    'table.category': 'الفئة',
    'table.amount': 'المبلغ',
    'table.date': 'التاريخ',
    'table.status': 'الحالة',
    'table.actions': 'الإجراءات',
    
    // Messages
    'message.no_expenses': 'لا توجد مصروفات',
    'message.error': 'حدث خطأ',
    'message.success': 'تم الحفظ بنجاح',
    
    // Form Placeholders
    'form.placeholder.group_name': 'مثال: تجديد المطبخ، صيانة السيارة',
  },
  en: {
    // App
    'app.title': 'Expense Tracker',
    'app.settings': 'Settings',
    'app.language': 'Language',
    'app.close': 'Close',
    
    // Expense Form
    'expense.add': 'Add New Expense',
    'expense.edit': 'Edit Expense',
    'expense.description': 'Description',
    'expense.category': 'Category',
    'expense.amount': 'Amount (EGP)',
    'expense.date': 'Date',
    'expense.status': 'Status',
    'expense.save': 'Save',
    'expense.cancel': 'Cancel',
    'expense.delete': 'Delete',
    'expense.edit_btn': 'Edit',
    
    // Group
    'group.add': 'Add New Group',
    'group.edit': 'Edit Group',
    'group.name': 'Group Name',
    'group.items_count': 'items',
    'group.total': 'Total',
    'group.paid_total': 'Paid',
    'group.no_groups': 'No groups found',
    'group.no_items': 'No items in this group',
    
    // Item
    'item.add': 'Add Item',
    'item.edit': 'Edit Item',
    'item.delete': 'Delete Item',
    
    // Categories
    'category.maintenance': 'Maintenance Work',
    'category.home': 'Home',
    'category.other': 'Other',
    
    // Status
    'status.paid': 'Paid',
    'status.unpaid': 'Unpaid',
    
    // Table Headers
    'table.description': 'Description',
    'table.category': 'Category',
    'table.amount': 'Amount',
    'table.date': 'Date',
    'table.status': 'Status',
    'table.actions': 'Actions',
    
    // Messages
    'message.no_expenses': 'No expenses found',
    'message.error': 'An error occurred',
    'message.success': 'Saved successfully',
    
    // Form Placeholders
    'form.placeholder.group_name': 'e.g., Kitchen Renovation, Car Maintenance',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}