# 📨 Praise App — Anonymous Feedback

> Create private rooms, share a code with friends, and collect honest anonymous feedback.

## 💡 Why?

People rarely get honest feedback in daily life — colleagues and friends hold back to avoid awkwardness. **Praise App** uses a "room" model (like game lobbies) to let you safely collect anonymous feedback within your trusted circle, helping you discover how others really see you.

## ✨ Features

- 🏠 **Create Rooms** — Set a topic (e.g., "Feedback on my presentation"), get a 6-digit room code
- 🔗 **One-Click Share** — Share the code or link — no registration needed for participants
- ✍️ **Fully Anonymous** — No identity, IP, or personal data is recorded for senders
- 📬 **Async Messaging** — Receive messages while offline; they're waiting when you log back in
- 🔴 **Unread Badges** — New messages highlighted in red, mark all as read in one click
- 🔒 **Private by Design** — Only people with the room code can enter, keeping outsiders away

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + React 19 + Tailwind CSS 4 |
| Backend | Next.js API Routes + TypeScript |
| Database | SQLite (local dev) / Turso (production) |
| Auth | JWT (jose) + bcryptjs |
| Deployment | Vercel + Turso |

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

No database setup needed — uses a local SQLite file automatically.

### Deploy to Vercel

1. Fork this repo
2. Create a free database at [Turso](https://turso.tech)
3. Import to Vercel and set environment variables:
   - `JWT_SECRET` — random secret key
   - `TURSO_DATABASE_URL` — your Turso database URL
   - `TURSO_AUTH_TOKEN` — your Turso auth token
4. Deploy!

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── login/page.tsx           # Login
│   ├── register/page.tsx        # Register
│   ├── join/page.tsx            # Join a room
│   ├── dashboard/page.tsx       # Dashboard (my rooms)
│   ├── dashboard/rooms/[id]/    # Room detail (view messages)
│   ├── room/[code]/page.tsx     # Anonymous message page
│   └── api/                     # API routes
│       ├── auth/                # Register / Login / Logout / Me
│       └── rooms/               # Room & message CRUD
├── lib/
│   ├── db.ts                    # Database connection
│   ├── auth.ts                  # JWT + password hashing
│   ├── queries.ts               # Database query helpers
│   └── room-code.ts             # Room code generation
├── middleware.ts                 # Auth middleware
└── types/index.ts               # TypeScript types
```

## 🔄 How It Works

```
Room Creator                    Friends (no account needed)
    │                                │
    ├─ Sign up / Log in              │
    ├─ Create room → get code        │
    ├─ Share code ────────────────→  │
    │                                ├─ Enter room code
    │                                ├─ Write anonymous note ✍️
    │                                └─ Send ✅
    ├─ Log in → check inbox 📬      │
    ├─ Unread badges 🔴             │
    └─ Discover real feedback 🎉     │
```

## 📄 License

MIT
