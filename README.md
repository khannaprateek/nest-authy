# NEST-AUTHY

A NestJS authentication and authorization system with role-based access control, built using TypeScript and featuring JWT authentication strategy.

## Project Overview

This project implements a secure authentication and authorization system using NestJS framework with the following key features:

- JWT and Local authentication strategies
- Role-based access control (RBAC)
- TypeORM integration with PostgreSQL
- Swagger API documentation
- Modular architecture with clear separation of concerns

## Project Structure

```
src/
├── dtos/                 # Data Transfer Objects
│   ├── auth-response.dto.ts
│   ├── create-user.dto.ts
│   ├── login.dto.ts
│   └── user-response.dto.ts
├── entities/            # TypeORM entities
│   └── user.entity.ts
├── guards/              # Authentication & Authorization guards
│   ├── jwt-auth.guard.ts
│   ├── local-auth.guard.ts
│   └── roles.guard.ts
├── modules/
│   ├── auth/           # Authentication module
│   │   ├── decorators/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   └── user/           # User management module
│       ├── user.controller.ts
│       ├── user.module.ts
│       └── user.service.ts
└── util/               # Utility functions and constants
    ├── constants.ts
    └── enum.ts
```

## Prerequisites

- Node.js >= 14.x
- PostgreSQL >= 12
- npm or yarn
- TypeScript >= 4.x

## Installation & Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables by creating a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=nest_authy_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

```

3. Start the development server:

```bash
npm run start:dev
```

## API Documentation

Access the Swagger documentation at: `http://localhost:3000/um-api`

### Key Endpoints

#### Authentication

- `POST /auth/login` - Authenticate user
- `POST /auth/register` - Register new user

#### User Management

- `GET /users` - List all users (Protected: Admin)
- `GET /users/:id` - Get user details (Protected: Admin, Owner)
- `PATCH /users/:id` - Update user (Protected: Admin, Owner)
- `DELETE /users/:id` - Delete user (Protected: Admin)

## Implementation Details

### Authentication Flow

1. **Registration**:

   - User data validation using DTOs
   - Password hashing using bcrypt
   - User creation in database

2. **Login**:

   - Credentials validation using LocalStrategy
   - JWT token generation
   - Return of auth response with token

3. **Protected Routes**:
   - JWT token validation using JwtStrategy
   - Role verification using RolesGuard
   - Request processing if authorized

### Design Decisions & Assumptions

1. **Authentication Strategy**:

   - Chose JWT for stateless authentication
   - Implemented both local and JWT strategies for flexibility
   - Assumed short-lived tokens without refresh token mechanism

2. **Database Design**:

   - Used TypeORM for database operations
   - Implemented soft delete for user records
   - Assumed single-role per user design

3. **Security Measures**:
   - Password hashing using bcrypt
   - Role-based access control
   - Request validation using class-validator
   - TypeORM parameterized queries for SQL injection prevention

## Development Challenges & Solutions

1. **Role-Based Authorization**:

   - Challenge: Implementing flexible role checks
   - Solution: Custom RolesGuard with decorator-based role definition

2. **Type Safety**:

   - Challenge: Maintaining type safety across DTOs and entities
   - Solution: Strict TypeScript configuration and shared interfaces

3. **Error Handling**:
   - Challenge: Consistent error responses
   - Solution: Global exception filter with standardized error format

## Future Improvements

1. **Authentication Enhancements**:

   - Implement refresh token mechanism
   - Add OAuth2.0 support
   - Implement MFA (Multi-Factor Authentication)

2. **Security Improvements**:

   - Add rate limiting
   - Implement request logging
   - Add IP-based blocking

3. **Feature Additions**:

   - Password reset functionality
   - Email verification
   - User profile management
   - Activity logging

4. **Technical Improvements**:
   - Add comprehensive test coverage
   - Implement caching layer
   - Add Docker support
   - Implement CI/CD pipeline

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
