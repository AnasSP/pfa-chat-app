# PFA Chat Application

A modern real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js), featuring real-time messaging, user authentication, and a UI built using Tailwind CSS.

## Features

- Real-time messaging using Socket.IO
- User authentication with JWT
- Group chat support
- Message history
- Message notifications
- Profile customization
- Media sharing capabilities
- Modern UI with Tailwind CSS and Radix UI components

## Tech Stack

### Frontend
- React (Vite)
- Socket.IO Client
- Tailwind CSS
- Radix UI Components
- Zustand for state management
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT for authentication
- Multer for file uploads

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pfa-chat-app.git
cd pfa-chat-app
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development servers:

For the backend:
```bash
cd server
npm run dev
```

For the frontend:
```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173` and the server on `http://localhost:5000`

## Usage

1. Launch the application in your browser
2. Sign up or log in to your account
3. Start chatting with other users
4. Create or join group chats
5. Customize your profile
6. Share media and messages

Project Link: [https://github.com/yourusername/pfa-chat-app](https://github.com/yourusername/pfa-chat-app)
