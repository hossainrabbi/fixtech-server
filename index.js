const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kiqx3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect((err) => {
    const servicesCollection = client
        .db(`${process.env.DB_NAME}`)
        .collection(`${process.env.DB_SERVICES_COLLECTION}`);
    const reviewsCollection = client
        .db(`${process.env.DB_NAME}`)
        .collection(`${process.env.DB_REVIEWS_COLLECTION}`);

    // Added Services
    app.post('/addServices', (req, res) => {
        const newServices = req.body;
        servicesCollection.insertOne(newServices).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    // All Services
    app.get('/services', (req, res) => {
        servicesCollection.find({}).toArray((err, result) => {
            res.send(result);
        });
    });

    // Added Reviews
    app.post('/addReviews', (req, res) => {
        const newReviews = req.body;
        reviewsCollection.insertOne(newReviews).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    // All Reviews
    app.get('/reviews', (req, res) => {
        reviewsCollection.find({}).toArray((err, result) => {
            res.send(result);
        });
    });

    err
        ? console.log('Database Connection Fail!')
        : console.log('Database Connection Successfully!');
});

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
);
