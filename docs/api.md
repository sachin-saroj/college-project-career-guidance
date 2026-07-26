# API Documentation

The CareerSathi REST API is hosted at `/api/v1`. All endpoints are prefixed with this base URL.

## Authentication

All protected routes require a Bearer token in the `Authorization` header, or a valid HTTP-only `token` cookie.

```http
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### Register User
- **Method**: `POST`
- **URL**: `/auth/register`
- **Description**: Register a new student or mentor.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "role": "student"
  }
  ```
- **Responses**:
  - `201 Created`: User registered successfully, returns JWT token.
  - `400 Bad Request`: Validation error.

### Login User
- **Method**: `POST`
- **URL**: `/auth/login`
- **Description**: Authenticate a user and receive a JWT.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
- **Responses**:
  - `200 OK`: Returns JWT token and sets HTTP-only cookie.
  - `401 Unauthorized`: Invalid credentials.

---

## 2. Assessment Endpoints

### Get Assessment Questions
- **Method**: `GET`
- **URL**: `/assessment/questions`
- **Description**: Fetch questions for the psychometric test.
- **Responses**:
  - `200 OK`: Array of question objects.

### Submit Assessment
- **Method**: `POST`
- **URL**: `/assessment/submit`
- **Description**: Submit user answers and calculate scores.
- **Request Body**:
  ```json
  {
    "answers": [
      { "questionId": "q1", "selectedOption": 2 }
    ]
  }
  ```
- **Responses**:
  - `200 OK`: Returns calculated aptitude, interest, and personality scores.

---

## 3. Career Recommendations

### Get Recommendations
- **Method**: `GET`
- **URL**: `/careers/recommendations`
- **Description**: Get career recommendations based on the user's latest assessment profile.
- **Responses**:
  - `200 OK`: Array of recommended careers with confidence scores.

---

## 4. AI Mentor

### Chat with Mentor
- **Method**: `POST`
- **URL**: `/mentor/chat`
- **Description**: Send a message to the AI mentor (powered by Gemini) and get a response.
- **Request Body**:
  ```json
  {
    "message": "What skills do I need to become a software engineer?"
  }
  ```
- **Responses**:
  - `200 OK`: Returns the AI's markdown-formatted response.

---

## 5. Portfolio & Resume Builder

### Get Portfolio
- **Method**: `GET`
- **URL**: `/portfolio`
- **Description**: Retrieve the current user's portfolio data.
- **Responses**:
  - `200 OK`: Portfolio data.

### Update Portfolio
- **Method**: `PUT`
- **URL**: `/portfolio`
- **Description**: Update the user's portfolio (projects, education, experience).
- **Request Body**: JSON representation of the updated portfolio.
- **Responses**:
  - `200 OK`: Updated portfolio.

---

## 6. Resources

### Get Resources
- **Method**: `GET`
- **URL**: `/resources`
- **Query Parameters**:
  - `category` (optional): Filter by category (e.g., 'course', 'scholarship').
  - `search` (optional): Keyword search.
  - `page`, `limit` (optional): Pagination.
- **Responses**:
  - `200 OK`: Paginated list of resources.

### Bookmark Resource
- **Method**: `POST`
- **URL**: `/resources/bookmarks`
- **Request Body**:
  ```json
  {
    "resourceId": "60b8d295f1d2c72b8c9a3e5c"
  }
  ```
- **Responses**:
  - `201 Created`: Resource bookmarked.

---

## 7. Admin Endpoints

Admin routes are protected by RBAC and require `role: 'admin'`.

### Get Dashboard Stats
- **Method**: `GET`
- **URL**: `/admin/stats`
- **Responses**:
  - `200 OK`: Aggregated metrics (total users, assessments taken, etc.).

### Manage Users
- **Method**: `GET`
- **URL**: `/admin/users`
- **Description**: Get a paginated list of all users.
