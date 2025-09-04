# FBR Live Invoicing - Monorepo

This is a monorepo containing both the frontend React application and backend Express.js server for the FBR Live Invoicing system.

## Project Structure

```
fbr-live-invoicing/
├── client/                 # React frontend application
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── dist/              # Built frontend (generated)
│   └── package.json       # Frontend dependencies
├── server/                # Express.js backend server
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── package.json           # Root package.json (monorepo)
├── .env                   # Shared environment variables
└── README.md             # This file
```

## Prerequisites

- Node.js 22 LTS (recommended)
- npm or yarn

## Quick Start

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start development servers (both frontend and backend):**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173 (development)
   - Backend API: http://localhost:3000/api
   - Production build served by backend: http://localhost:3000

## Available Scripts

### Root Level (Monorepo)
- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only the client in development mode
- `npm run dev:server` - Start only the server in development mode
- `npm run build` - Build both client and server
- `npm run build:client` - Build only the client
- `npm run build:server` - Build only the server
- `npm start` - Start the production server
- `npm run install:all` - Install dependencies for all packages

### Client (React App)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server (Express.js)
- `npm run dev` - Start server with nodemon (development)
- `npm start` - Start production server
- `npm run build` - No build step needed for Node.js

## Development Workflow

1. **Development Mode:**
   - Frontend runs on port 5173 with hot reload
   - Backend runs on port 3000
   - API calls from frontend are proxied to backend

2. **Production Mode:**
   - Frontend is built to `client/dist/`
   - Backend serves the built frontend from `client/dist/`
   - Everything runs on port 3000

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Client Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Add other environment variables as needed
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/example` - Example API endpoint

## Technology Stack

### Frontend
- React 18
- Material Tailwind React
- Tailwind CSS
- Vite
- React Router DOM
- ApexCharts

### Backend
- Express.js
- CORS
- Helmet (security)
- Morgan (logging)
- Dotenv (environment variables)

## Contributing

1. Make sure you're using Node.js 22 LTS
2. Install dependencies with `npm run install:all`
3. Start development servers with `npm run dev`
4. Make your changes
5. Test both frontend and backend functionality

## License

This project is licensed under the MIT License.
# Deployment trigger
