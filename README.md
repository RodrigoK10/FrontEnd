# User Management System

A modern web application for user management with authentication.

## Features

- User authentication (login)
- User management (CRUD operations)
- Modern UI with Tailwind CSS
- Secure API communication
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Backend Requirements

This frontend application expects a backend server running at `http://localhost:3001` with the following API endpoints:

- POST `/api/auth/login` - User authentication
- GET `/api/usuarios` - Get all users
- POST `/api/usuarios` - Create new user
- PUT `/api/usuarios/:id` - Update user
- DELETE `/api/usuarios/:id` - Delete user

## Environment Variables

No environment variables are required for development. For production, you may want to configure the API URL.

## Technologies Used

- React
- React Router
- Axios
- Tailwind CSS
- Vite
