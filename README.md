# Simple CRUD App

A User Management System built with Node.js, Express, and PostgreSQL. Complete CRUD operations with a clean, responsive interface.

## Features

- ✅ Create, Read, Update, Delete users
- ✅ Form validation and error handling
- ✅ Responsive design
- ✅ RESTful API
- ✅ PostgreSQL database

## Tech Stack

- **Backend:** Node.js, Express.js, PostgreSQL
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Database:** PostgreSQL with pg client

## Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Andryandraina/simple-crud-app.git
cd simple-crud-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create database:**
```sql
CREATE DATABASE crud_app;
\c crud_app;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. **Environment setup:**
Create `.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/crud_app
PORT=3000
```

5. **Run the app:**
```bash
npm run dev
```

6. **Open browser:** `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## Project Structure

```
simple-crud-app/
├── server.js          # Express server
├── package.json       # Dependencies
├── .env              # Environment variables
└── public/           # Frontend files
    ├── index.html    # Main page
    ├── css/style.css # Styles
    └── js/main.js    # Frontend logic
```

## License

MIT License

## Contact

**Andryandraina** - [GitHub](https://github.com/Andryandraina)
