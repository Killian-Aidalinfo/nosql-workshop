const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// Mongoose connection
mongoose.connect('mongodb://localhost:27017/restaurants', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
//Connect to schema mongo to collections new york
const Restaurant = mongoose.model('Restaurant', new mongoose.Schema({}, { strict: false }), 'new_york');
// Routes
// Route pour récupérer tous les restaurants
app.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.send(restaurants);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Test with http://localhost:3000/restaurant/Wilken'S Fine Food
app.get('/restaurant/:name', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ name: req.params.name });
        if (!restaurant) return res.status(404).send('Restaurant not found');
        res.send(restaurant);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Request in postman with body format json
app.post('/restaurant', async (req, res) => {
    try {
        const newRestaurant = new Restaurant(req.body);
        await newRestaurant.save();
        res.send(newRestaurant);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update existing restaurant with put
app.put('/restaurant/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!restaurant) return res.status(404).send('Restaurant not found');
        res.send(restaurant);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a restaurant
app.delete('/restaurant/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) return res.status(404).send('Restaurant not found');
        res.send('Restaurant deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
