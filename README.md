# Heal & Play 🎮❤️

> **Play Games. Save Lives.**

A platform where users play small games and pay tiny amounts that go directly to sick children's medical treatments. Every rupee matters.

---

## ✨ Features

- 🎮 Games to unlock (Spin & Win, Scratch Card, Memory Match, Treasure Hunt)
- 🏷️ Shopping coupons (Flipkart, Amazon, Google Play, Paytm)
- 💬 Inspirational quotes
- 🎁 Free daily rewards
- 🤍 100% transparent donation breakdown
- 📊 Real-time donation progress per child
- 🔒 Secure payments

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone <repo-url>
cd donate
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### 3. Start the Backend

```bash
cd backend
cp .env.example .env        # Fill in your MONGO_URI and JWT_SECRET
npm install
npm run dev
# Runs at http://localhost:5000
```

---

## 📁 Folder Structure

```
donate/
├── frontend/               # React + Vite + Tailwind
│   └── src/
│       ├── animations/     # Framer Motion variants
│       ├── components/     # Reusable UI components
│       ├── context/        # React context (Auth, Donation)
│       ├── hooks/          # Custom hooks
│       ├── layouts/        # Page layouts
│       ├── pages/          # Route pages
│       ├── routes/         # Route guards (future)
│       ├── services/       # Axios API helpers
│       └── utils/          # Utility functions
│
└── backend/                # Node.js + Express + MongoDB
    ├── config/             # DB connection
    ├── controllers/        # Route handlers
    ├── middleware/         # Error handler, auth guard
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routers
    ├── uploads/            # File uploads
    └── utils/              # Helpers
```

---

## 🎨 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Animations | Framer Motion |
| Routing | React Router DOM v6 |
| HTTP | Axios |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (coming soon) |
| Payments | Razorpay (coming soon) |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/children` | Get all children |
| GET | `/api/children/:id` | Get child by ID |
| POST | `/api/donations` | Create donation |
| GET | `/api/games` | Get all games |
| GET | `/api/coupons` | Get all coupons |

---

## 🌱 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/healandplay
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 📝 License

MIT © 2024 Heal & Play
