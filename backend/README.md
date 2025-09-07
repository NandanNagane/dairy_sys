# Smart Dairy Management System - Backend

A comprehensive backend API system for managing dairy operations, farmers, milk collections, payments, and expenses.

## Project Structure

This is the backend part of the Smart Dairy Management System. The project is organized as follows:

```
Dairy Management Sys/
├── backend/           # Backend API (Node.js/Express)
├── frontend/          # Frontend application
└── .gitignore        # Root-level gitignore for the entire project
```

## Features

- **User Authentication**: JWT-based authentication with role-based access control (Admin/Farmer)
- **Milk Collection Management**: Record and track daily milk collections with quality parameters
- **Payment Processing**: Automated billing generation and payment tracking
- **Expense Management**: Track operational expenses with categorization
- **PDF Reports**: Generate detailed farmer statements and reports
- **RESTful API**: Well-structured API endpoints with proper validation and error handling

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **PDF Generation**: PDFKit
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
src/
├── server.js                 # Main server file
├── middleware/
│   └── auth.middleware.js     # Authentication middleware
├── utils/
│   └── pdf.util.js           # PDF generation utilities
└── api/
    ├── auth/                 # Authentication endpoints
    │   ├── auth.routes.js
    │   └── auth.controller.js
    ├── users/                # User management
    │   ├── users.routes.js
    │   └── users.controller.js
    ├── milk-collections/     # Milk collection management
    │   ├── milk-collections.routes.js
    │   └── milk-collections.controller.js
    ├── payments/             # Payment and billing
    │   ├── payments.routes.js
    │   └── payments.controller.js
    ├── expenses/             # Expense management
    │   ├── expenses.routes.js
    │   └── expenses.controller.js
    └── reports/              # Report generation
        ├── reports.routes.js
        └── reports.controller.js
```

## Installation

1. **Clone the repository and navigate to backend**
   ```bash
   git clone <repository-url>
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
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/initialize-admin` - Create first admin user (one-time)
- `POST /api/v1/auth/register` - Register new farmer
- `POST /api/v1/auth/login` - User login

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/me` - Get current user profile
- `GET /api/v1/users/:id` - Get user by ID (Admin only)
- `GET /api/v1/users/:userId/milk-collections` - Get user's milk collections
- `GET /api/v1/users/:userId/payments` - Get user's payment history

### Milk Collections
- `POST /api/v1/milk-collections` - Record milk collection (Admin only)
- `GET /api/v1/milk-collections` - Get all collections (Admin only)
- `GET /api/v1/milk-collections/:id` - Get specific collection (Admin only)
- `PUT /api/v1/milk-collections/:id` - Update collection (Admin only)
- `DELETE /api/v1/milk-collections/:id` - Delete collection (Admin only)

### Payments & Billing
- `POST /api/v1/billing/generate` - Generate billing from unbilled collections (Admin only)
- `GET /api/v1/payments` - Get all payments (Admin only)
- `GET /api/v1/payments/:id` - Get specific payment (Admin only)
- `PATCH /api/v1/payments/:id` - Update payment status (Admin only)

### Expenses
- `POST /api/v1/expenses` - Record expense (Admin only)
- `GET /api/v1/expenses` - Get all expenses (Admin only)
- `GET /api/v1/expenses/:id` - Get specific expense (Admin only)
- `PUT /api/v1/expenses/:id` - Update expense (Admin only)
- `DELETE /api/v1/expenses/:id` - Delete expense (Admin only)

### Reports
- `GET /api/v1/reports/farmer-statement/:userId` - Generate PDF farmer statement

## Database Schema

The system uses the following main entities:

- **User**: Stores farmer and admin information
- **MilkCollection**: Records daily milk collection data
- **Payment**: Tracks payment records and billing
- **Expense**: Manages operational expenses

## Usage Examples

### Initialize Admin User
```bash
curl -X POST http://localhost:3000/api/v1/auth/initialize-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@dairy.com",
    "password": "securepassword"
  }'
```

### Register Farmer
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Farmer",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Record Milk Collection
```bash
curl -X POST http://localhost:3000/api/v1/milk-collections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "farmer_user_id",
    "quantity": 25.5,
    "fatPercentage": 4.2,
    "snf": 8.7
  }'
```

### Generate Billing
```bash
curl -X POST http://localhost:3000/api/v1/billing/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "periodStartDate": "2024-01-01",
    "periodEndDate": "2024-01-31",
    "ratePerLiter": 35
  }'
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with configurable salt rounds
- **Rate Limiting**: Prevents abuse with request rate limiting
- **CORS Protection**: Cross-origin request handling
- **Input Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Secure error messages without sensitive data exposure

## Development

### Database Management
```bash
# View database in Prisma Studio
npm run db:studio

# Create and apply migrations
npm run db:migrate

# Reset database
npx prisma migrate reset
```

### Code Quality
- Follow the existing code structure and naming conventions
- Add proper error handling for all async operations
- Include appropriate logging for debugging
- Write descriptive commit messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
