const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

app.use(cors());
app.use(bodyParser.json());

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