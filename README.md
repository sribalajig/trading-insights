# Stock Insights App

A full-stack application for researching and analyzing stock market data with real-time insights and recommendations.

## Architecture

This project follows a clean architecture pattern with separation of concerns:

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + Vite + TypeScript + D3

## Project Structure

```
trading_insights/
├── backend/
│   └── src/
│       ├── routes/        # Express route definitions
│       ├── controllers/   # Request handlers
│       ├── services/      # Business logic layer
│       ├── thirdParty/    # Yahoo Finance wrapper abstractions
│       ├── models/        # TypeScript interfaces and types
│       └── index.ts       # Entry point
├── frontend/
│   └── src/
│       ├── components/    # React components
│       ├── hooks/         # Custom React hooks
│       ├── logic/         # Business logic
│       ├── utils/         # Utility functions
│       ├── models/        # TypeScript interfaces and types
│       ├── App.tsx        # Main app component
│       └── main.tsx       # Entry point
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional, for custom port):
   ```
   PORT=3000
   ```

4. Run in development mode:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

The backend server will run on `http://localhost:3000` by default.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

The frontend will run on `http://localhost:5173` by default.

## Development Plan

Features will be implemented incrementally:

1. **Live ticker search** - Auto-suggest dropdown for stock symbols
2. **Get latest price** - Real-time stock price retrieval
3. **Historical data** - Daily granularity charts with time range selection
4. **Recommendations** - BUY/SELL/HOLD analysis with confidence scores

## Technology Stack

### Backend
- Node.js
- Express.js
- TypeScript
- yahoo-finance2 (for real stock data)

### Frontend
- React 18
- Vite
- TypeScript
- D3.js (for data visualization)

## License

ISC

