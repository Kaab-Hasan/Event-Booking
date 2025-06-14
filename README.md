# Event Booking System

A full-stack web application for managing event bookings with admin approval workflow.

## Features

### User Features
- User registration and authentication
- Create event booking requests
- View personal booking history
- Real-time status updates
- Responsive design for all devices

### Admin Features
- Secure admin dashboard
- View all event bookings
- Approve/reject event requests
- Edit event details
- View booking statistics and analytics
- Filter events by status
- Real-time updates

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Chart.js for analytics
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event-booking-system
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Events
- `POST /api/events` - Create a new event request
- `GET /api/events` - Get all events (admin only)
- `GET /api/events/user/:email` - Get events by user email
- `GET /api/events/:id` - Get event by ID
- `PATCH /api/events/:id/status` - Update event status
- `PATCH /api/events/:id` - Update event details

## Project Structure

```
event-booking-system/
├── frontend/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── EventForm.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── eventController.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── events.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── README.md
```

## Features in Detail

### Authentication System
- Secure user registration and login
- JWT-based authentication
- Protected routes for authenticated users
- Admin role-based access control

### Event Booking
- Create event requests with:
  - Event name
  - Date and time
  - Description
- Real-time status updates
- Email-based event tracking

### Admin Dashboard
- Comprehensive event management
- Status updates (approve/reject)
- Event editing capabilities
- Statistical analysis:
  - Total events
  - Status distribution
  - Time slot analysis
  - Event timeline

### User Interface
- Modern, responsive design
- Intuitive navigation
- Real-time feedback
- Loading states and alerts
- Form validation
- Error handling

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected API endpoints
- Input validation
- Error handling middleware

## Performance Optimizations
- Memoized components
- Optimized database queries
- Efficient state management
- Lazy loading of components
- Caching strategies

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@eventbooking.com or create an issue in the repository.