import React from 'react';
import axios from 'axios';
// import './App.css';
import Login from "./Login";

const express = require("express");
const app = express();

let port = process.env.PORT;
if(port == null || port == "") {
 port = 5000;
}

app.listen(port, function() {
 console.log("Server started successfully");
});

function App() {
    return (
      <div className="App">
        <header className="App-header">
          <Quotes />
        </header>
      </div>
    );
  }
  export default App;