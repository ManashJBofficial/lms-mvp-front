# LMS (Learning Management System) Documentation Frontend

## Tech Stack
- **Frontend**: 
  - React.js with TypeScript
  - Shadcn UI Components
  - TailwindCSS for styling
  - React Query for data fetching
  - React Hook Form for form management
  - Zod for form validation

- **Backend**:
  - Node.js
  - Express.js
  - Prisma ORM
  - JWT for authentication

- **Database**:
  - MySQL

## Completed Features

1. **Authentication**
   - User registration with email verification
   - Login system
   - Role-based access (Admin/Instructor)
   - Secure password handling

2. **Admin Features**
   - Course CRUD operations
   - Unique course code generation
   - Instructor management
   - Notice board management
   - Excel upload for bulk teacher addition
   - Comprehensive dashboard with analytics

3. **Instructor Features**
   - Course joining via course code
   - Notice board interaction
   - Profile management
   - Course-specific views

4. **Dashboard Analytics**
   - Total course count
   - Average teachers per course
   - Gender distribution analysis
   - Notice board engagement metrics
   - Course-wise notice updates

## Incomplete Features

1. **Average Duration Tracking**
   - Teacher time spent on LMS not implemented (Would require additional tracking mechanisms)

## Assumptions Made

1. Single session per user
2. Email verification required for registration
3. Course codes are unique and auto-generated
4. Notice board updates checked every 30 seconds
5. Excel upload format is standardized

## Technical Decisions

### Why Polling vs Socket.io?

1. **Simplicity**
   - Polling is easier to implement and maintain
   - Suitable for our use case where real-time updates aren't critical

2. **Resource Efficiency**
   - Lower server resources compared to maintaining WebSocket connections
   - Adequate for periodic updates (every 30 seconds)

3. **Scalability**
   - Easier to scale with traditional HTTP infrastructure
   - No need to manage WebSocket connection states

4. **Use Case Appropriateness**
   - Our LMS doesn't require instantaneous updates
   - Notice board updates are not time-critical

## Setup Instructions

1. **Prerequisites**
   - Node.js (v18+)
   - MySQL
   - Git

2. **Installation Steps**
   ```bash
   # Clone repository
   git clone [repository-url]

   # Frontend setup
   cd frontend
   npm install
   npm run dev

   # Backend setup
   cd backend
   npm install
   npm run dev
   ```

3. **Environment Setup**
   - Create `.env` files in both frontend and backend
   - Configure database connections
   - Set up JWT secrets

4. **Database Setup**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```


