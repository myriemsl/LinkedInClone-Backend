const express = require('express');
const app = express();

// Import database connection
const ConnectDB = require('./Config/ConnectDB');

// Connect to databse
ConnectDB();

// Parse the data
app.use(express.json());

// Define Routes
app.use("/signup", require('./Routes/Signup.Routes.js'));
app.use("/signin", require('./Routes/Signin.Routes.js'));
app.use("/posts", require('./Routes/Post.Routes.js'));
app.use("/profile", require('./Routes/Profile.Routes.js'))

// Server 
app.listen(5000, (err) => {
    if (err) console.log(err)
    else console.log("server running on port 5000");
});