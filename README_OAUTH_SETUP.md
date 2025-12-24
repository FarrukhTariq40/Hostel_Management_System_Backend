# OAuth Setup Instructions

## Email Configuration (for Password Reset)

1. Add the following environment variables to your `.env` file:

```env
# Email Configuration (for password reset)
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # Use Gmail App Password, not regular password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Roomify Hostel

# Alternative: Use SMTP settings
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_EMAIL=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
```

### Gmail Setup:
1. Enable 2-factor authentication on your Google account
2. Go to Google Account Settings > Security > App Passwords
3. Generate an app password for "Mail"
4. Use this app password as `EMAIL_PASSWORD`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" > "Create Credentials" > "OAuth client ID"
5. Configure OAuth consent screen (if not done already)
6. Application type: Web application
7. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
8. Copy Client ID and Client Secret
9. Add to `.env`:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Go to Settings > Basic and note your App ID and App Secret
5. Add authorized redirect URI: `http://localhost:5000/api/auth/facebook/callback`
6. Add to `.env`:

```env
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

## Session Secret

Add a session secret to your `.env` file:

```env
SESSION_SECRET=your-random-session-secret-key-here
```

## Complete .env Example

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`

# MongoDB
MONGODB_URI=mongodb://localhost:27017/hostel_management

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Session
SESSION_SECRET=your-random-session-secret-key-here

# Email
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Roomify Hostel

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth - Facebook
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

## Testing

1. Start the backend server: `npm run dev`
2. Start the frontend: `npm start`
3. Click "Google" or "Facebook" on the login page
4. Complete OAuth flow
5. You should be redirected back and logged in

## Troubleshooting

- **Email not sending**: Check Gmail App Password is correct, not regular password
- **OAuth redirect error**: Verify redirect URIs match exactly in OAuth provider settings
- **CORS errors**: Ensure FRONTEND_URL is set correctly in backend .env






