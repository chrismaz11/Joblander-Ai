# API Authentication Guide

This guide explains how to authenticate with the JobLander API using Supabase Auth tokens.

## Authentication Flow

1. **Login via Supabase Auth**
   ```javascript
   const { data: { session }, error } = await supabase.auth.signIn({
     email: 'user@example.com',
     password: 'secure-password'
   });
   ```

2. **Get the Access Token**
   ```javascript
   const token = session.access_token;
   ```

3. **Use Token in API Requests**
   ```javascript
   // Example fetch request
   const response = await fetch('https://api.joblander.org/api/me', {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   });
   ```

## Protected Routes

All protected routes require a valid JWT token in the Authorization header:

### GET /api/me
Returns the current user's profile.

**Request:**
```bash
curl -H "Authorization: Bearer <your-token>" https://api.joblander.org/api/me
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "authMethod": "supabase"
  },
  "message": "Protected route accessed successfully"
}
```

### GET /api/my-data
Returns example protected data.

**Request:**
```bash
curl -H "Authorization: Bearer <your-token>" https://api.joblander.org/api/my-data
```

**Response:**
```json
{
  "message": "Data retrieved successfully",
  "data": {
    "userId": "user-id",
    "timestamp": "2025-11-01T12:00:00Z",
    "authMethod": "supabase"
  }
}
```

## Error Responses

- **401 Unauthorized**: Missing or invalid token
  ```json
  {
    "error": "Missing Authorization header"
  }
  ```
  or
  ```json
  {
    "error": "Invalid token"
  }
  ```

- **500 Internal Server Error**: Server-side error
  ```json
  {
    "error": "Internal server error",
    "details": "Error details here"
  }
  ```

## Legacy Token Support

For backward compatibility, the API temporarily supports legacy JWT tokens. Usage of legacy tokens is:
- Logged to server logs with warning
- Recorded in the `auth_audit` table
- Will be deprecated in future versions

Monitor legacy token usage in the Supabase dashboard under:
- Database → Tables → auth_audit
- Server logs (filter for "[auth] legacy JWT secret used")