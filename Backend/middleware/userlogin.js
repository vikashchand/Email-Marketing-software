// Middleware to authenticate user login
const userLogin = (req, res, next) => {
    // Assuming you have the logic to retrieve the user's email from the request
    const userEmail = req.user.email;
  
    // Set the email in res.locals
    res.locals.email = userEmail;
  
    next(); // Call next() to pass control to the next middleware or route handler
  };
  
  module.exports = userLogin;
  