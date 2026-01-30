# QuickCart

A full-stack web application with React.js frontend and Express.js/Node.js backend for user authentication (Login and Sign Up).

## Project Structure

- `frontend/` — React.js application (created with Create React App)
  - Login page with Email and Password textboxes
  - Separate Sign Up page with Full Name, Email, Password, and Phone Number fields
  - React Router for navigation between pages
  - Light green and dark green color palette with QuickCart cart logo

- `backend/` — Express.js/Node.js server with MongoDB database
  - REST API endpoints: `POST /api/login` and `POST /api/signup`
  - Mongoose for MongoDB integration
  - Password hashing with bcrypt

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB running locally (or MongoDB Compass with connection string)

### Backend Setup

1. Navigate to the backend folder and install dependencies:

```powershell
cd backend
npm install
```

2. (Optional) Create a `.env` file in the backend folder with your MongoDB connection:

```
MONGO_URI=mongodb://127.0.0.1:27017/quickcart
PORT=5000
```

3. Start the backend server:

```powershell
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder and install dependencies:

```powershell
cd frontend
npm install
```

2. Start the React development server:

```powershell
npm start
```

The app will open in your browser at `http://localhost:3000`

## Features

### Login Page
- Email and Password textboxes
- Login button
- Shows "Login successful!" message when credentials are correct
- Shows "Invalid credentials" message when credentials are wrong
- "Sign Up" button to navigate to registration page

### Sign Up Page
- Full Name, Email, Password, and Phone Number textboxes
- Sign Up button
- Separate page (not a popup or modal)
- Redirects to Login page after successful registration
- "Back to Login" link

### Design
- Light green (#e8f6ec) and dark green (#2e7d32) color palette
- Creative cart logo with "QuickCart" branding
- Clean, modern UI with card-based layout

## Technology Stack

- **Frontend**: React.js (Create React App), React Router
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (MongoDB Compass compatible)
- **Authentication**: bcrypt for password hashing

## API Endpoints

- `POST /api/login` - Login with email and password
- `POST /api/signup` - Register new user with full name, email, password, and phone

## Docker Setup (Alternative)

If you prefer to run the entire application with Docker:

### Prerequisites
- Docker and Docker Compose installed

### Run with Docker

1. Make sure Docker is running on your system

2. Build and start all services (MongoDB, Backend, Frontend):

```powershell
docker-compose up --build
```

3. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`
   - MongoDB: `localhost:27017`

4. To stop all services:

```powershell
docker-compose down
```

5. To stop and remove all data (including database):

```powershell
docker-compose down -v
```

### Docker Services

The `docker-compose.yaml` file creates three services:
- **mongodb**: MongoDB 7.0 database container
- **backend**: Express.js/Node.js API server
- **frontend**: React.js application

All services are connected via a custom Docker network and the database data is persisted in a Docker volume.

## Notes

- Passwords are securely hashed using bcrypt before storing in the database
- CORS is enabled for frontend-backend communication
- For production, add JWT/session tokens, input validation, and HTTPS
- Docker setup includes MongoDB so you don't need to install it locally
