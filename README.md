# Smart Dairy Management System

A comprehensive full-stack application for managing dairy operations, farmers, milk collections, payments, and expenses.

## Project Structure

```
Dairy Management Sys/
├── backend/           # Backend API (Node.js/Express/Prisma/PostgreSQL)
│   ├── src/
│   │   ├── api/       # API routes and controllers
│   │   ├── middleware/# Authentication and other middleware
│   │   ├── utils/     # Utility functions (PDF generation, etc.)
│   │   └── server.js  # Main server file
│   ├── prisma/        # Database schema and migrations
│   └── package.json
├── frontend/          # Frontend application (React/Next.js/etc.)
├── .gitignore        # Root-level gitignore
└── README.md         # This file
```

## Features

- **User Authentication**: JWT-based authentication with role-based access control (Admin/Farmer)
- **Milk Collection Management**: Record and track daily milk collections with quality parameters
- **Payment Processing**: Automated billing generation and payment tracking
- **Expense Management**: Track operational expenses with categorization
- **PDF Reports**: Generate detailed farmer statements and reports
- **RESTful API**: Well-structured API endpoints with proper validation and error handling

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **PDF Generation**: PDFKit
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: [To be implemented - React/Next.js/Vue.js/etc.]
- **Styling**: [To be determined]
- **State Management**: [To be determined]

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd "Dairy Management Sys/backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL="postgresql://username:password@localhost:5432/dairy_management?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   BCRYPT_ROUNDS=12
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

The backend API will be available at `http://localhost:3000`

### Frontend Setup
[Instructions to be added when frontend is implemented]

## API Documentation

The backend provides a comprehensive REST API. Key endpoints include:

### Authentication
- `POST /api/v1/auth/initialize-admin` - Create first admin user (one-time)
- `POST /api/v1/auth/register` - Register new farmer
- `POST /api/v1/auth/login` - User login

### Milk Collections
- `POST /api/v1/milk-collections` - Record milk collection (Admin only)
- `GET /api/v1/milk-collections` - Get all collections (Admin only)

### Payments & Billing
- `POST /api/v1/billing/generate` - Generate billing from unbilled collections (Admin only)
- `GET /api/v1/payments` - Get all payments (Admin only)

### Reports
- `GET /api/v1/reports/farmer-statement/:userId` - Generate PDF farmer statement

For complete API documentation, see the [backend README](./backend/README.md).

## Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server with nodemon
npm run db:studio    # Open Prisma Studio for database management
npm run db:migrate   # Create and apply database migrations
```

### Frontend Development
[Instructions to be added when frontend is implemented]

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@smartdairy.com or create an issue in this repository.
