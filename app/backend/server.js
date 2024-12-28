const express = require('express');
const connectDb = require('./config/db');
const authRoute = require('./routes/Auth');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

connectDb();

app.use('/api/auth', authRoute);

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
