# Deck of Cards Frontend

A modern, responsive React application for card game management and gameplay. Built with React 19 and Vite, this frontend provides authentication, user dashboards, and interactive card game experiences with real-time state management.

## Overview

The Deck of Cards Frontend is a full-featured single-page application (SPA) that enables users to create game sessions, manage card decks, track player statistics, and enjoy interactive card games. The application includes robust authentication, role-based access control, and an intuitive admin panel for system management.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [API Routes](#api-routes)
- [Environment Configuration](#environment-configuration)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Authentication & Authorization**: Secure login/registration with JWT tokens and role-based access control
- **Game Management**: Create, manage, and play card game sessions with real-time deck state tracking
- **User Dashboards**: Personal user profile, chip balance tracking, and account settings
- **Admin Panel**: Comprehensive admin dashboard for user management with sortable tables, promote/demote functionality, and soft-delete user accounts
- **Responsive Design**: Fully responsive Bootstrap 5 layout optimized for desktop, tablet, and mobile
- **Real-Time Updates**: Live card draw mechanics with immediate UI updates
- **Protected Routes**: Route-level authentication enforcement with automatic redirection
- **Icon Integration**: Phosphor icons for modern, accessible UI elements

## Technology Stack

| Category | Technologies |
|----------|---------------|
| **Frontend Framework** | React 19, JSX |
| **Build Tool** | Vite 8 |
| **Routing** | React Router DOM 6 |
| **Styling** | Bootstrap 5, CSS3 |
| **HTTP Client** | Axios |
| **Date Handling** | Day.js |
| **Icons** | Phosphor Icons |
| **Linting** | ESLint |
| **Package Manager** | npm |

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── DisplayCards.jsx    # Card display with overlap styling
│   ├── Modal.jsx           # Reusable modal component
│   ├── NavBar.jsx          # Main navigation bar
│   ├── NewDeckForm.jsx     # Game creation form
│   ├── Spinner.jsx         # Loading indicator
│   └── UserNavBar.jsx      # User-specific navigation
├── constants/              # Application constants
│   └── games.js            # Game-related constants
├── features/               # Feature-based modules
│   ├── auth/               # Authentication & authorization
│   │   ├── AdminRoute.jsx  # Admin-only route protection
│   │   ├── AuthContext.jsx # Global auth state management
│   │   └── ProtectedRoute.jsx # User-level route protection
│   ├── games/              # Game-specific features
│   │   ├── CurrentGame.jsx
│   │   ├── IntroStudPoker.jsx
│   │   ├── StudPokerHistory.jsx
│   │   └── StudPokerLineChart.jsx
│   └── users/              # User-specific features
│       ├── Chips.jsx       # Chip balance management
│       ├── Settings.jsx    # User settings page
│       ├── UpdatePassword.jsx
│       └── UserMain.jsx    # User dashboard
├── pages/                  # Page components
│   ├── About.jsx
│   ├── AdminPage.jsx       # Admin dashboard with user management
│   ├── Contact.jsx
│   ├── Games.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── StudPoker.jsx
│   └── User.jsx
├── services/               # API client functions
│   ├── adminApi.js         # Admin operations
│   ├── authApi.js          # Authentication endpoints
│   ├── chipService.js      # Chip management
│   └── deckService.js      # Deck & game operations
├── utils/                  # Utility functions
│   ├── formatCurrency.js   # Currency formatting
│   └── studPokerHelper.js  # Poker game helpers
├── App.jsx                 # Main application component
├── main.jsx                # Application entry point
├── App.css                 # Global application styles
└── index.css               # Base styles
```

## Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- Access to the backend API (running on `http://localhost:8000` by default)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/deckofcard.git
   cd deckofcard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Development

### Running the Development Server

```bash
npm run dev
```

This starts Vite's development server with hot module replacement (HMR) for instant code updates.

### Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on `http://localhost:5173` |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

### Code Quality

- **ESLint**: Enforces consistent code style and catches potential errors
- Run linter: `npm run lint`
- Auto-fix issues: `npm run lint -- --fix`

## Build & Deployment

### Production Build

```bash
npm run build
```

This creates an optimized, minified production bundle in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing before deployment.

### Deployment Options

- **Vercel**: Zero-config deployment with automatic builds
- **Netlify**: Connect GitHub repo for CI/CD
- **GitHub Pages**: Static hosting for SPA
- **Traditional Hosting**: Upload `dist/` folder to any static web server

## API Routes

The application communicates with the backend API at `http://localhost:8000`.

### Authentication Routes
- `POST /auth/register` — Register new user account
- `POST /auth/login` — Authenticate user and receive JWT token
- `POST /auth/logout` — Invalidate session token

### User Routes
- `GET /users/` — Retrieve all active users
- `GET /users/{user_id}` — Get specific user details
- `GET /users/chip-counts` — Get all users with chip balances and role information
- `PUT /users/{user_id}` — Update user profile
- `DELETE /users/{user_id}` — Soft delete user account

### Admin Routes
- `POST /users/{user_id}/make-admin` — Promote user to admin role
- `GET /admin/users` — List all users (admin only)

### Game Routes
- `GET /games/` — List active games
- `POST /games/` — Create new game session
- `GET /games/{game_id}` — Get game details

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Optional: Environment identifier
VITE_ENV=development
```

**Note**: Environment variables must be prefixed with `VITE_` to be accessible in the browser.

## Architecture

### Authentication Flow

1. User registers/logs in through `LoginPage.jsx`
2. Credentials sent to backend API
3. JWT token received and stored in browser
4. `AuthContext.jsx` manages global authentication state
5. Protected routes validated via `ProtectedRoute.jsx` and `AdminRoute.jsx`
6. Automatic redirect to login if token invalid

### State Management

- **Global Auth State**: `AuthContext.jsx` using React Context API
- **Local Component State**: `useState` hook for component-level state
- **API State**: Loading, error, and data states managed in each service

### Component Hierarchy

- `App.jsx` — Main application wrapper with routing
- Route-level components (`pages/`) — Top-level page views
- Feature components (`features/`) — Feature-specific logic
- Reusable components (`components/`) — Shared UI elements

## Contributing

### Code Style

- Follow ESLint configuration for consistency
- Use semantic component naming
- Comment complex logic
- Keep components focused and single-responsibility

### Submitting Changes

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature description'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request with detailed description

## License

This project is provided for educational and demonstration purposes.
