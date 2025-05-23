# 💰 Expense Tracker (My Costs AIO)

A modern, bilingual expense tracking application built with Next.js 15, featuring Arabic and English support with RTL layout.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🌍 Bilingual Support**: Full Arabic and English localization with RTL layout
- **📁 Group-Based Organization**: Organize expenses into customizable groups (Maintenance, Home, Other)
- **💳 Expense Tracking**: Add, edit, and delete individual expense items
- **📊 Visual Analytics**: Real-time totals with paid/unpaid status tracking
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **💾 File-Based Storage**: Simple JSON file storage for easy data management
- **🔄 Real-Time Updates**: Instant UI updates without page refreshes

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Storage**: JSON files
- **Internationalization**: Custom translation system

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/essambarghsh/my-costs-aio.git
   cd my-costs-aio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Managing Groups

1. **Create a Group**: Click "Add New Group" and fill in the group name and category
2. **Edit a Group**: Click the "Edit" button on any group header
3. **Delete a Group**: Click the "Delete" button (confirms before deletion)

### Managing Expenses

1. **Add an Expense**: Click "Add Item" within any group
2. **Track Status**: Mark expenses as "Paid" or "Unpaid"
3. **View Totals**: See real-time calculations for each group and overall totals

### Language Settings

- Click the "Settings" button in the header
- Switch between Arabic (العربية) and English
- Layout automatically adjusts for RTL/LTR

## 🏗️ Project Structure

```
my-costs-aio/
├── app/
│   ├── api/
│   │   └── groups/
│   │       ├── route.ts          # Group CRUD operations
│   │       └── items/
│   │           └── route.ts      # Item CRUD operations
│   ├── contexts/
│   │   └── LanguageContext.tsx   # i18n and language management
│   ├── globals.css               # Global styles and RTL support
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Main application component
├── data/
│   └── groups.json              # Data storage (auto-created)
└── public/                      # Static assets
```

## 🔌 API Endpoints

### Groups

- `GET /api/groups` - Fetch all groups
- `POST /api/groups` - Create a new group
- `PUT /api/groups` - Update an existing group
- `DELETE /api/groups?id={groupId}` - Delete a group

### Group Items

- `POST /api/groups/items` - Add item to a group
- `PUT /api/groups/items` - Update an existing item
- `DELETE /api/groups/items?groupId={groupId}&itemId={itemId}` - Delete an item

## 🎨 Customization

### Adding New Categories

Edit the category types in `app/api/groups/route.ts`:

```typescript
category: 'maintenance' | 'home' | 'other' | 'your-new-category';
```

### Adding New Languages

Extend the translations in `app/contexts/LanguageContext.tsx`:

```typescript
const translations: Record<Language, Record<TranslationKey, string>> = {
  ar: { /* Arabic translations */ },
  en: { /* English translations */ },
  // Add your language here
};
```

### Styling

The app uses Tailwind CSS. Customize the design by modifying classes in components or extending the theme in `tailwind.config.ts`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from emoji sets

## 📧 Support

If you have any questions or run into issues, please open an issue on GitHub.

---

**Made with ❤️ for expense tracking**