# Deck of Cards Game

A React + Vite application that integrates with the Deck of Cards API to create, manage, and play card game sessions.

Players can start a new game with a shuffled deck, draw cards from an active game, and view deck status and drawn cards in a responsive interface.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Features

- Create a new game session using the Deck of Cards API
- Generate a freshly shuffled deck with optional jokers
- Draw cards one at a time from an active deck
- View remaining cards and deck metadata
- Display drawn cards with responsive overlap styling
- Protect routes with authentication context
- User dashboard with profile, chips, and settings pages
- Responsive layout using Bootstrap

## Demo

1. Visit the login page and authenticate.
2. Create a new game from the Games page.
3. The app requests a new shuffled deck from the Deck of Cards API.
4. The new game is stored in local state and the user is navigated to the current game view.
5. Draw cards and watch the remaining count update in real time.
6. Return to Games to manage existing sessions.

## Technology Stack

- React 19
- Vite
- React Router DOM
- Bootstrap 5
- Axios
- Day.js
- JavaScript (ES6+)

## Project Structure

```text
src/
├── components/
│   ├── NavBar.jsx
│   ├── NewDeckForm.jsx
│   └── UserNavBar.jsx
├── constants/
│   └── games.js
├── features/
│   ├── auth/
│   │   ├── AuthContext.jsx
│   │   └── ProtectedRoute.jsx
│   ├── games/
│   │   └── CurrentGame.jsx
│   └── users/
│       ├── Chips.jsx
│       ├── Settings.jsx
│       └── UserMain.jsx
├── pages/
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Games.jsx
│   ├── LoginPage.jsx
│   └── User.jsx
├── services/
│   ├── authApi.js
│   └── deckService.js
├── App.jsx
├── index.css
├── main.jsx
└── App.css
```

## Routes

- `/` — Home / Games page (protected)
- `/login` — Login page
- `/about` — About page
- `/contact` — Contact page
- `/user` — User dashboard (protected)
- `/user/chips` — User chips page (protected)
- `/user/settings` — User settings page (protected)
- `/game/:deckId` — Current game view for drawing cards

## Installation

```bash
git clone https://github.com/<your-username>/<repository-name>.git
cd <repository-name>
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Available Scripts

- `npm run dev` — Start local development server
- `npm run build` — Build production bundle
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint checks

## API Integration

This project uses the public Deck of Cards API.

### Create a New Deck

```http
GET https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1
```

### Draw Cards

```http
GET https://deckofcardsapi.com/api/deck/{deck_id}/draw/?count=1
```

## Future Enhancements

- Persist game sessions in local storage or backend
- Add multiplayer support and score tracking
- Implement game history and session recovery
- Add card discard / hand management
- Add dark mode and theme support

## License

This project is provided for educational and demonstration purposes.
