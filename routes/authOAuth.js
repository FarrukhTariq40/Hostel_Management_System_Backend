const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with this email
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          name: profile.displayName || profile.name.givenName + ' ' + profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
          password: crypto.randomBytes(32).toString('hex'), // Random password for OAuth users
          role: 'student', // Default role
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Configure Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists with this Facebook ID
        let user = await User.findOne({ facebookId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with this email
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (email) {
          user = await User.findOne({ email });

          if (user) {
            // Link Facebook account to existing user
            user.facebookId = profile.id;
            await user.save();
            return done(null, user);
          }
        }

        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: email || `${profile.id}@facebook.com`,
          facebookId: profile.id,
          password: crypto.randomBytes(32).toString('hex'), // Random password for OAuth users
          role: 'student', // Default role
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`}/login?error=google_auth_failed` }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);
      const redirectUrl = `${process.env.FRONTEND_URL || `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`}/auth/callback?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`}/login?error=google_auth_failed`);
    }
  }
);

// Facebook OAuth Routes
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.FRONTEND_URL || `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`}/login?error=facebook_auth_failed` }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);
      const redirectUrl = `${process.env.FRONTEND_URL || `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`}/auth/callback?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Facebook OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`}/login?error=facebook_auth_failed`);
    }
  }
);

module.exports = router;

