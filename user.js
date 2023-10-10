const express = require('express');
const bodyParser = require('body-parser');

// Create a new Express application
const app = express();

// Use bodyParser middleware to parse JSON bodies
app.use(bodyParser.json());

// Define a new route to handle POST requests
app.post('/api/endpoint', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    console.log(email, password);

    // ... do something with email and password ...

    // Send a response back to the client
    res.json({ message: 'Data received!' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
