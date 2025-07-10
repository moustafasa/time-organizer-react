const allowedOrigins = require("./allowedOrigins");
corsOptions = {
  origin: (origin, callback) => {
    if (
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV !== "production"
    ) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by cors"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};

module.exports = corsOptions;
