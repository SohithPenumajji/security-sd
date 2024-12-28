const mongoose = require('mongoose');
require('dotenv').config();

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully.');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message || err);
        process.exit(1); // Exit process with failure code
    }
};

module.exports = connectToDb;
