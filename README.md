# AI Tutor - AI-Powered English Learning Platform

An interactive AI-powered English learning platform built with Next.js, TypeScript, Prisma, and OpenAI. AI Tutor provides personalized English tutoring through an intelligent chat interface.

![NextJS](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenAI](https://img.shields.io/badge/ChatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white)

## 💾 Database Setup

### Schema

The application uses two main models:

**User Model**

```prisma
model User {
  id            Int           @id @default(autoincrement())
  name          String
  email         String        @unique
  password      String
  goal          String?       # Learning goal
  level         String?       # Proficiency level
  createdAt     DateTime      @default(now())
  conversations Conversation[]
}
```

**Conversation Model**

```prisma
model Conversation {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    Int
  messages  Json     # Stores chat history
  createdAt DateTime @default(now())
}
```

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/signup`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "code": 201,
  "message": "Successfully registered new account!"
}
```

**Validation:**

- Name: Required, max 100 characters
- Email: Valid email format required
- Password: Minimum 6 characters

---

#### POST `/api/login`

Authenticate an existing user.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "code": 200,
  "message": "Successfully Logged in",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**

```json
{
  "code": 401,
  "error": "Invalid email or password!"
}
```

---

### Chat Endpoints

#### GET `/api/onboarding/chat`

Retrieve conversation history for the authenticated user.

**Headers:**

```
x-user-id: {userId}
```

**Response (200):**

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "userId": 1,
    "messages": [
      {
        "role": "ai",
        "content": "Hi John! Welcome to JaPi. What's your English learning goal?",
        "date": "2025-10-30T10:00:00.000Z"
      }
    ],
    "createdAt": "2025-10-30T09:00:00.000Z"
  }
}
```

---

#### POST `/api/onboarding/chat`

Send a message and receive AI response.

**Headers:**

```
x-user-id: {userId}
```

**Request Body:**

```json
{
  "message": "I want to improve my business English"
}
```

**Response (200):**

```json
{
  "code": 200,
  "data": {
    "reply": "Great! Business English is very useful. What's your current level?",
    "goal": "improve business English",
    "level": ""
  }
}
```

**AI Onboarding Flow:**

1. **Step 1/2**: Extract user's learning goal

   - AI asks: "What's your English learning goal?"
   - Stores goal, then asks about proficiency level

2. **Step 2/2**: Extract proficiency level

   - AI asks: "What's your English level? (beginner/intermediate/advanced)"
   - Stores level, then starts first lesson

3. **Active Learning**: Once profile complete, provides personalized tutoring

## 🔑 Authentication

### JWT Token Flow

1. **Signup/Login**: User provides credentials
2. **Token Generation**: Server creates JWT with user ID and email
3. **Token Storage**: Client stores token in cookies
4. **Protected Routes**: Middleware validates token
5. **User Identification**: Token payload extracted for API calls

## 🧪 Development

### Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Code Quality

- **ESLint**: Code linting with Next.js config
- **TypeScript**: Strict type checking
- **Zod**: Runtime validation for API inputs

### Environment Setup

Ensure all environment variables are configured in your deployment platform:

- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_BASE_URL`

---

**Built with ❤️**
