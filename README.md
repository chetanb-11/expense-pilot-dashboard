# ExpensePilot Dashboard UI

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/chetanb-11s-projects/v0-expense-pilot-dashboard-ui)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/TJ5NH7iVffN)

## 📋 Overview

ExpensePilot is a modern, responsive dashboard for personal finance management. Built with Next.js and TypeScript, it provides an intuitive interface for tracking income, expenses, and financial goals. The dashboard integrates with a Spring Boot backend API to fetch and display financial data in real-time. It includes user authentication to protect user data.

## ✨ Features

- **User Authentication**: Secure user registration and login functionality.
- **Protected Routes**: Ensures that only authenticated users can access the dashboard and transactions pages.
- **Dashboard Overview**: Comprehensive view of total income, expenses, and net savings.
- **Transaction Management**: View, add, and manage financial transactions.
- **Expense Categories**: Visual breakdown of spending by category with percentage charts.
- **Real-time Data**: Fetches live data from the backend API with fallback support.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Modern UI**: Clean, professional interface using Radix UI and shadcn/ui components.
- **Dark/Light Mode**: Theme support for better user experience.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2.16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations and `tailwindcss-animate`.
- **UI Components**: Radix UI primitives and shadcn/ui.
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization.
- **Forms**: React Hook Form with Zod for validation.
- **Theming**: `next-themes` for dark/light mode.
- **State Management**: Context API for theme and potentially auth.
- **Utility Libraries**: `date-fns` for date formatting, `clsx` and `tailwind-merge` for class name management.

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

### Authentication
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Authenticate a user and receive a JWT.

### Expenses
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

## 🔐 Authentication Flow
The frontend application manages authentication using JWT (JSON Web Tokens).
1.  A user registers or logs in through the `/register` or `/login` pages.
2.  Upon successful authentication, the backend sends a JWT to the client.
3.  The JWT is stored securely in the browser (e.g., in `localStorage` or `sessionStorage`).
4.  For subsequent requests to protected API routes, the JWT is included in the `Authorization` header.
5.  The `protected-route.tsx` component wraps pages that require authentication. It checks for the presence of a valid token and redirects unauthenticated users to the login page.
6.  The `lib/auth.ts` file contains helper functions for managing the authentication token.

## 📁 Project Structure

```
expense-pilot-dashboard/
├── app/                    # Next.js app directory
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard page (protected)
│   ├── login/              # Login page
│   │   └── page.tsx
│   ├── register/           # Registration page
│   │   └── page.tsx
│   └── transactions/       # Transactions pages (protected)
│       ├── page.tsx
│       └── new/
│           └── page.tsx
├── components/             # Reusable components
│   ├── ui/                 # UI components from shadcn/ui (Button, Card, etc.)
│   ├── new-transaction.tsx
│   ├── protected-route.tsx # HOC for protecting routes
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── transactions-list.tsx
├── lib/                    # Utility functions
│   ├── auth.ts             # Authentication-related helpers
│   └── utils.ts            # General utility functions
├── public/                 # Static assets
└── styles/                 # Additional styles
```

## ⚙️ Configuration
The `next.config.mjs` file contains the following notable configurations:
- **`eslint: { ignoreDuringBuilds: true }`**: ESLint errors will not fail the production build.
- **`typescript: { ignoreBuildErrors: true }`**: TypeScript errors will not fail the production build.
- **`images: { unoptimized: true }`**: The Next.js Image Optimization API is disabled.

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
