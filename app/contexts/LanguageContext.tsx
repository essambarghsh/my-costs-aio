'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

type TranslationKey = 
  | 'app.title' | 'app.settings' | 'app.language' | 'app.close'
  | 'expense.add' | 'expense.edit' | 'expense.description' | 'expense.category' 
  | 'expense.amount' | 'expense.date' | 'expense.status' | 'expense.save' 
  | 'expense.cancel' | 'expense.delete' | 'expense.edit_btn'
  | 'category.maintenance' | 'category.home' | 'category.other'
  | 'status.paid' | 'status.unpaid'
  | 'table.description' | 'table.category' | 'table.amount' | 'table.date' 
  | 'table.status' | 'table.actions'
  | 'message.no_expenses' | 'message.error' | 'message.success';

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