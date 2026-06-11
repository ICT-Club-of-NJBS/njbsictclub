# NJBS ICT Club - API Documentation

## Base URL

```
http://localhost:3000  (Development)
https://your-domain.com (Production)
```

---

## Authentication Endpoints

### 1. Sign Up
**Endpoint:** `POST /api/auth/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe",
  "phone": "+92123456789"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "userId": "NJBS-20260425123456",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "token": "jwt_token_here"
}
```

**Error (400):**
```json
{
  "error": "Email already registered"
}
```

---

### 2. Log In
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "userId": "NJBS-20260425123456",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "member"
  },
  "token": "jwt_token_here"
}
```

**Error (401):**
```json
{
  "error": "Invalid email or password"
}
```

---

### 3. Get Current User
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token> (or JWT in cookie)
```

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "NJBS-20260425123456",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "member",
  "status": "active"
}
```

**Error (401):**
```json
{
  "error": "Unauthorized"
}
```

---

### 4. Request Password Reset
**Endpoint:** `POST /api/auth/forgot-password`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reset code sent to email",
  "code": "123456"  // For development only
}
```

**Note:** The code is sent via email (or logged in development)

---

### 5. Reset Password
**Endpoint:** `POST /api/auth/reset-password`

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewSecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error (400):**
```json
{
  "error": "Invalid reset code"
}
```

---

## Event Endpoints

### 1. Register for Event ⭐
**Endpoint:** `POST /api/events/[eventId]/register`

**Parameters:**
- `eventId` - The ID of the event (from URL)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+92123456789",
  "message": "I'm very interested in this event!"
}
```

**Response (201):**
```json
{
  "success": true,
  "registration": {
    "id": "uuid",
    "event_id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+92123456789",
    "message": "I'm very interested in this event!",
    "status": "registered",
    "registered_at": "2026-04-25T10:30:00Z"
  },
  "message": "Successfully registered for the event!"
}
```

**Error (400):**
```json
{
  "error": "You are already registered for this event"
}
```

**Error (400):**
```json
{
  "error": "Event registration is full"
}
```

---

### 2. Check Event Registration
**Endpoint:** `GET /api/events/[eventId]/register`

**Parameters:**
- `eventId` - The ID of the event (from URL)
- `email` - Email to check (query parameter)

**URL Example:**
```
GET /api/events/abc123/register?email=john@example.com
```

**Response (200) - Registered:**
```json
{
  "registered": true,
  "registration": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+92123456789",
    "message": "I'm very interested!",
    "status": "registered",
    "registered_at": "2026-04-25T10:30:00Z"
  }
}
```

**Response (200) - Not Registered:**
```json
{
  "registered": false
}
```

---

## Admin Endpoints

All admin endpoints require `role: 'admin'` and valid JWT token.

### 1. Get Event Registrations (Admin)
**Endpoint:** `GET /api/admin/events/[eventId]/registrations`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "event": {
    "id": "uuid",
    "name": "Club Meetup",
    "event_date": "2026-05-15T15:00:00Z",
    "location": "Main Hall",
    "max_registrations": 100
  },
  "registrations": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+92123456789",
      "message": "I'm very excited!",
      "status": "registered",
      "registered_at": "2026-04-25T10:30:00Z"
    },
    {
      "id": "uuid",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+92987654321",
      "message": null,
      "status": "registered",
      "registered_at": "2026-04-25T11:00:00Z"
    }
  ],
  "totalRegistrations": 2
}
```

**Error (404):**
```json
{
  "error": "Event not found"
}
```

---

### 2. Update Registration Status (Admin)
**Endpoint:** `PUT /api/admin/events/[eventId]/registrations`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "registrationId": "uuid",
  "status": "attended"
}
```

**Valid Status Values:**
- `registered`
- `attended`
- `cancelled`
- `no-show`

**Response (200):**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "status": "attended",
  "updated_at": "2026-04-25T14:30:00Z"
}
```

---

### 3. Delete Registration (Admin)
**Endpoint:** `DELETE /api/admin/events/[eventId]/registrations`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "registrationId": "uuid"
}
```

**Response (200):**
```json
{
  "message": "Registration deleted successfully"
}
```

---

## User Admin Endpoints

### 1. List All Users
**Endpoint:** `GET /api/admin/users`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "users": [
    {
      "id": "uuid",
      "user_id": "NJBS-20260425123456",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "member",
      "status": "active",
      "created_at": "2026-04-20T10:00:00Z"
    }
  ]
}
```

---

### 2. Get User Details
**Endpoint:** `GET /api/admin/users/[userId]`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "user_id": "NJBS-20260425123456",
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "+92123456789",
  "role": "member",
  "status": "active"
}
```

---

### 3. Update User
**Endpoint:** `PUT /api/admin/users/[userId]`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "role": "admin",
  "status": "active",
  "full_name": "John Doe Updated"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "user_id": "NJBS-20260425123456",
  "email": "user@example.com",
  "full_name": "John Doe Updated",
  "role": "admin",
  "status": "active"
}
```

---

### 4. Delete User
**Endpoint:** `DELETE /api/admin/users/[userId]`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request / validation error |
| 401 | Unauthorized / invalid token |
| 404 | Not found |
| 409 | Conflict (e.g., email already exists) |
| 500 | Server error |

---

## Authentication

### JWT Token Flow

1. **Login/Signup** - Returns JWT token
2. **Token Format** - Stored in HTTP-only cookie `auth_token`
3. **Token Expiration** - 7 days
4. **Usage** - Send `Authorization: Bearer <token>` header OR let cookie be sent automatically

### Example with cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get current user (token in cookie or header)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."

# Register for event
curl -X POST http://localhost:3000/api/events/abc123/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+92123456789",
    "message": "Excited to attend!"
  }'
```

---

## Response Format

All responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { /* ... */ }
}
```

### Error Response
```json
{
  "error": "Error message here",
  "status": 400
}
```

---

## Rate Limiting

Currently no rate limiting. Implement in production as needed.

---

## CORS

CORS is configured to allow requests from your app domain.

---

## Testing Tools

### Postman
1. Import API collection
2. Add token to Authorization tab
3. Test endpoints

### cURL
See examples above

### JavaScript Fetch
```javascript
// Register for event
const response = await fetch('/api/events/abc123/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+92123456789',
    message: 'Excited to attend!'
  })
});

const data = await response.json();
console.log(data);
```

---

## Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/signup` | POST | No | Create account |
| `/api/auth/login` | POST | No | Login |
| `/api/auth/me` | GET | Yes | Get user info |
| `/api/auth/forgot-password` | POST | No | Request reset |
| `/api/auth/reset-password` | POST | No | Reset password |
| `/api/events/[id]/register` | POST | No | Register for event |
| `/api/events/[id]/register` | GET | No | Check registration |
| `/api/admin/events/[id]/registrations` | GET | Yes | View registrations |
| `/api/admin/events/[id]/registrations` | PUT | Yes | Update status |
| `/api/admin/events/[id]/registrations` | DELETE | Yes | Delete registration |
| `/api/admin/users` | GET | Yes | List users |
| `/api/admin/users` | POST | Yes | Create user |
| `/api/admin/users/[id]` | GET | Yes | Get user |
| `/api/admin/users/[id]` | PUT | Yes | Update user |
| `/api/admin/users/[id]` | DELETE | Yes | Delete user |

---

**Last Updated:** April 25, 2026
