// import axios from 'axios';
// import './App.css';
// import Login from "./app/screens/Login";

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;


// Define a ping/health-check route
app.get('/api', (req, res) => {
  res.json({ message: 'Connection to the backend is working!' });
});

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});