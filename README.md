# Fatwave Surf Resort - Hotel Booking System

<div align="center">
  <img src="frontend/public/logo.png" alt="Fatwave Surf Resort Logo" width="120" />
  
  **A modern surf resort hotel reservation system for Fatwave Surf Resort, La Union, Philippines**
  
  🌐 [fatwavesurf.com](https://fatwavesurf.com) | ✉️ reservations@fatwavesurf.com
</div>

---

## Overview

A full-stack MERN hotel booking system featuring a premium guest experience, manual payment verification, admin dashboard, PDF/email receipts, SEO, and PWA support.

## Live Demo

- **Website**: [fatwavesurfresort.com](https://fatwavesurfresort.com)
- **Frontend**: Hosted on Vercel
- **Backend API**: Hosted on Render

## Tech Stack

### Frontend

- **React 18** + **Vite**
- **Tailwind CSS** - Custom ocean/sand palette
- **Zustand** - State management
- **React Router** - Routing
- **jsPDF + html2canvas** - PDF receipts
- **Sonner** - Toast notifications

### Backend

- **Node.js + Express** - REST API
- **MongoDB + Mongoose** - Database
- **Nodemailer** - Email service with PDF attachments

## Features

### 🏄 Guest Features

- Browse rooms with beautiful imagery
- Real-time availability checking
- Interactive calendar date picker
- Flexible guest count
- Secure booking with verification code
- Downloadable PDF receipts
- Email confirmation with receipt attachment

### 🛠️ Admin Features

- Secure authentication
- Dashboard with booking analytics
- Room management (CRUD)
- Booking management & manual payment verification

## Project Structure

```
Fatwave Surf Resort/
├── backend/
│   ├── config/           # Database & constants
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Auth & validation
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── services/         # Email & PDF
│   ├── utils/            # Helpers
│   └── server.js
│
├── frontend/
│   ├── public/           # Static assets, logo, SEO files
│   └── src/
│       ├── components/   # UI components & Receipt
│       ├── lib/          # PDF generator, utilities
│       ├── pages/        # Route pages
│       ├── services/     # API service layer
│       └── store/        # Zustand stores
│
├── README.md
└── DEPLOYMENT.md
```

## Quick Start

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/fatwave-surf-resort.git
cd Fatwave Surf Resort

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=yourpassword
EMAIL_FROM="Fatwave Surf Resort" <noreply@fatwavesurfresort.com>
MONGO_URI=mongodb://localhost:27017/fatwave
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

```bash
# Terminal 1 - Backend (port 5000)
cd backend && npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend && npm run dev
```

## API Reference

### Public Endpoints

| Method | Endpoint                     | Description          |
| ------ | ---------------------------- | -------------------- |
| GET    | `/api/rooms`                 | List available rooms |
| GET    | `/api/rooms/:id`             | Get room details     |
| POST   | `/api/bookings`              | Create booking       |
| POST   | `/api/bookings/confirm`      | Confirm with code    |
| POST   | `/api/bookings/send-receipt` | Email receipt        |

### Admin Endpoints (Protected)

| Method | Endpoint                          | Description     |
| ------ | --------------------------------- | --------------- |
| POST   | `/api/admin/login`                | Admin login     |
| GET    | `/api/admin/dashboard`            | Dashboard stats |
| GET    | `/api/admin/rooms`                | List all rooms  |
| POST   | `/api/admin/rooms`                | Create room     |
| PUT    | `/api/admin/rooms/:id`            | Update room     |
| DELETE | `/api/admin/rooms/:id`            | Delete room     |
| GET    | `/api/admin/bookings`             | List bookings   |
| PATCH  | `/api/admin/bookings/:id/confirm` | Confirm booking |

## Booking Flow

1. **Browse Rooms** → Guest explores available accommodations
2. **Select Dates** → Calendar picker with availability check
3. **Enter Details** → Guest information form
4. **Create Booking** → System generates verification code
5. **Admin Verification** → Code sent via email
6. **Confirm Booking** → Guest enters code
7. **Receive Receipt** → PDF generated & emailed

## SEO & Performance

- Optimized meta tags & Open Graph
- JSON-LD structured data (Schema.org)
- Sitemap & robots.txt
- PWA manifest
- Responsive images

## Contact

- **Website**: [fatwavesurf.com](https://fatwavesurf.com)
- **Email**: reservations@fatwavesurf.com
- **Location**: La Union, Philippines

## License

MIT

---

<div align="center">
  Built with ❤️ by RabbitDaCoder
</div>
