const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

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

app.post('/api/endpoint', async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    const uri = "mongodb+srv://local_kings_eye:BlbbhGACvgksJqL5@kings-eye.ouonoms.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
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

        console.log(`New device added with the following id: ${result.insertedId}`);

        await client.close();

        console.log(email, password);

        res.json({ message: 'Data received!' });
    } catch (err) {
        console.error(err);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});