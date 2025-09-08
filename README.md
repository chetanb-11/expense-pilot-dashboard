# ExpensePilot Dashboard UI

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/chetanb-11s-projects/v0-expense-pilot-dashboard-ui)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/TJ5NH7iVffN)

## 📋 Overview

ExpensePilot is a modern, responsive dashboard for personal finance management. Built with Next.js and TypeScript, it provides an intuitive interface for tracking income, expenses, and financial goals. The dashboard integrates with a Spring Boot backend API to fetch and display financial data in real-time.

## ✨ Features

- **Dashboard Overview**: Comprehensive view of total income, expenses, and net savings
- **Transaction Management**: View, add, and manage financial transactions
- **Expense Categories**: Visual breakdown of spending by category with percentage charts
- **Real-time Data**: Fetches live data from backend API with fallback support
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Clean, professional interface using Radix UI components
- **Dark/Light Mode**: Theme support for better user experience

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Theming**: next-themes for dark/light mode

### Development Tools
- **Build Tool**: Next.js CLI
- **Package Manager**: npm/pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Deployment**: Vercel

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm** or **pnpm**: Package manager
- **Git**: Version control system

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-pilot-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using pnpm
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

## 💻 Usage

### Development Server

Start the development server:

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Using npm
npm run build

# Using pnpm
pnpm build
```

### Start Production Server

```bash
# Using npm
npm start

# Using pnpm
pnpm start
```

### Linting

```bash
# Using npm
npm run lint

# Using pnpm
pnpm lint
```

## 🔗 API Integration

The dashboard integrates with a Spring Boot backend API. The main endpoints used:

- `GET /api/expenses` - Fetch all transactions
- `POST /api/expenses` - Create new transaction
- `PUT /api/expenses/{id}` - Update transaction
- `DELETE /api/expenses/{id}` - Delete transaction

### API Configuration

Update the API base URL in your environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

The application includes fallback data when the API is unavailable, ensuring a smooth user experience during development.

## 📁 Project Structure

```
expense-pilot-dashboard/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   └── transactions/      # Transactions pages
├── components/            # Reusable components
│   ├── ui/               # UI components (Radix UI)
│   ├── new-transaction.tsx
│   ├── transactions-list.tsx
│   └── theme-provider.tsx
├── lib/                   # Utility functions
├── public/                # Static assets
└── styles/                # Additional styles
```

## 🌐 Deployment

Your project is live at:

**[https://vercel.com/chetanb-11s-projects/v0-expense-pilot-dashboard-ui](https://vercel.com/chetanb-11s-projects/v0-expense-pilot-dashboard-ui)**

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔄 How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository from [v0.app](https://v0.app)
4. Vercel deploys the latest version from this repository

## 📞 Support

If you have any questions or need help, please open an issue in this repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
