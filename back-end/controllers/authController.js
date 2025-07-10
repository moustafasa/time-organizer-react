const jwt = require("jsonwebtoken");

// Define some constants
const SALT_ROUNDS = 10; // The number of salt rounds for hashing passwords
const bcrypt = require("bcryptjs");
const Users = require("../models/Users");

// A helper function to create a token from a payload
const createToken = (data, type) => {
  const payload = { ...data, date: (new Date() * Math.random()).toString(16) };
  if (type === "access") {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });
  } else if (type === "refresh") {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  }
};

const setRefreshToken = async (payload, res) => {
  const refresh = createToken(payload, "refresh");
  res.cookie("refreshToken", refresh, { httpOnly: true });
  const foundedUser = await Users.findById(payload.id);
  foundedUser.refresh = refresh;
  await foundedUser.save();
};

// A helper function to verify a token and get the decoded data
const verifyToken = (token, type) => {
  return jwt.verify(
    token,
    type === "access"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET,
    (err, decode) => (decode !== undefined ? decode : err)
  );
};

const hashPassword = (req, res, next) => {
  if (
    ["POST", "PUT"].includes(req.method) &&
    req.path !== "/login" &&
    req.body.password
  ) {
    // Hash the password with bcrypt
    bcrypt.hash(req.body.password, SALT_ROUNDS, (err, hash) => {
      if (err) {
        // Handle hashing error
        res.status(500).send(err.message);
      } else {
        // Replace the plain password with the hashed one
        req.body.password = hash;
        next();
      }
    });
  } else {
    next();
  }
};

const register = async (req, res) => {
  // Get the user data from the request body
  const { name, email, password } = req.body;

  // Check if the username is already taken
  try {
    const existingUser = await Users.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      // Return a 409 Conflict response
      res.status(409).send("email already exists");
    } else {
      // Create a new user record
      const newUser = await Users.create({
        name,
        email: email.toLowerCase(),
        password,
      });
      const payload = {
        id: newUser._id.toString(),
        name,
        email: email.toLowerCase(),
      };

      // Create a token for the new user
      const token = createToken(payload, "access");

      await setRefreshToken(payload, res);

      // Return a 201 Created response with the token
      res.status(201).json({ accessToken: token });
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const login = async (req, res) => {
  // Get the credentials from the request body
  const { email, password } = req.body;

  // Find the user by username
  const user = await Users.findOne({ email: email.toLowerCase() });
  if (user) {
    // Compare the password with the hashed one
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        // Handle comparison error
        res.status(500).send(err.message);
      } else {
        if (result) {
          const payload = {
            id: user._id.toString(),
            email: email.toLowerCase(),
            name: user.name,
          };
          // Passwords match, create a token for the user
          const token = createToken(payload, "access");
          // set refresh token in database and coockie
          setRefreshToken(payload, res);
          // Return a 200 OK response with the token
          res.status(200).json({ accessToken: token });
        } else {
          // Passwords don't match, return a 401 Unauthorized response
          res.status(401).send("Invalid credentials");
        }
      }
    });
  } else {
    // User not found, return a 404 Not Found response
    res.status(404).send("User not found");
  }
};

const refresh = async (req, res) => {
  console.log("refresh");
  // Get the refresh token from the cookie
  const refreshToken = req.cookies.refreshToken;

  // Verify the refresh token
  const decoded = verifyToken(refreshToken, "refresh");

  // Check if the refresh token is valid and not expired
  if (decoded && !decoded.message) {
    // Find the user by id
    const user = await Users.findById(decoded.id);

    // Check if the refresh token matches the one in the database
    if (user && user.refresh === refreshToken) {
      // Create a new access token
      const accessToken = createToken(
        {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
        "access"
      );

      // Token is valid, set the user id and roles in the request object
      req.userId = decoded.id;
      // Return a 200 OK response with the new access token
      res.status(200).json({ accessToken: accessToken });
    } else {
      // Refresh token does not match, return a 401 Unauthorized response
      res.status(401).send("Invalid refresh token");
    }
  } else {
    // Refresh token is invalid or expired, return a 401 Unauthorized response
    res.status(401).send("Invalid refresh token");
  }
};

const logout = async (req, res) => {
  const refresh = req.cookies.refreshToken;
  if (!refresh) {
    res.status(204);
  } else {
    res.clearCookie("refreshToken", { httpOnly: true });
    const user = await Users.findOne({ refresh });
    if (!user) {
      res.sendStatus(204);
    } else {
      user.refresh = "";
      try {
        await user.save();
        res.sendStatus(204);
      } catch (err) {
        res.status(500).send("Internal server error");
      }
    }
  }
};

// // A middleware to check the authorization header for a valid token
const checkAuth = (req, res, next) => {
  // Get the authorization header from the request
  const authorization = req.headers.authorization || req.headers.Authorization;

  if (req.path !== "/refresh") {
    // Check if the authorization header is present and has the format 'Bearer token'
    if (authorization && authorization.split(" ")[0] === "Bearer") {
      // Get the token from the authorization header
      const token = authorization.split(" ")[1];

      // Verify the token and get the decoded data
      const decoded = verifyToken(token, "access");
      // Check if the token is valid
      if (decoded && !decoded.message) {
        // Token is valid, set the user id and roles in the request object
        req.userId = decoded.id;
        req.userRoles = decoded.roles;
        next();
      } else {
        // Token is invalid, return a 401 Unauthorized response
        res.status(401).send("Invalid token");
      }
    } else {
      // Authorization header is not present or has a wrong format, return a 401 Unauthorized response
      res.status(401).send("Authorization header required");
    }
  } else {
    next();
  }
};

module.exports = {
  hashPassword,
  register,
  login,
  refresh,
  logout,
  checkAuth,
};
