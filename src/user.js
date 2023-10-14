const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect } = require('firebase/auth');
const { initializeApp } = require('firebase/app');
const { getAuth, GoogleAuthProvider, signInWithPopup } = require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyAekALAJx0_v1DYMn2z8ylTGAS8UJpo-mk",
    authDomain: "kings-eye-dd86f.firebaseapp.com",
    databaseURL: "https://kings-eye-dd86f-default-rtdb.firebaseio.com/",
    projectId: "kings-eye-dd86f",
    storageBucket: "kings-eye-dd86f.appspot.com",
    messagingSenderId: "923986711752",
    appId: "1:923986711752:web:847f178a8186a1549cc1fd",
    measurementId: "G-HKQ6670810"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const GOOGLE_PROVIDER = new GoogleAuthProvider();
const auth = getAuth();

const app = express();

app.use(cors());
app.use(bodyParser.json());

function stringToHash(string) {

    let hash = 0;

    if (string.length == 0) return hash;

    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return hash;
}

app.post('/signup', async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    const uri = "mongodb+srv://local_kings_eye:BlbbhGACvgksJqL5@kings-eye.ouonoms.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
        await client.connect();
        const result = await client.db("kings-eye").collection("user-database").insertOne(
            {
                email: email,
                id: stringToHash(email),
                password: password,
                fname: 'adi',
                lname: 'kumar',
                profilePic: 'base64string',
                games: []
            });

        await client.close();

        console.log("signed up", email, password);
        res.json({ message: 'Data received!' });
    } catch (err) {
        console.error(err);
    }
});

app.post('/login', async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    try {
        const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        console.log("logged in", email, password);
        res.json({ message: 'Data received!' });
    } catch (err) {
        console.error(err);
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});