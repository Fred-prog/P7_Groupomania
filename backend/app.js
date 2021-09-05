// Imports
const express = require('express');
// const cors = require('cors');
const path = require('path')

// ROUTES
const userRoutes = require('./routes/user');
const contentRoutes = require('./routes/content');
const postRoutes = require('./routes/post');

// DATABASE
const { sequelize } = require('./models/index');


// Intantiate application
const app = express();

// app.use(express.urlencoded({ extended: true }));
// app.use(cors()); // CORS - partage de ressources entre serveurs

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());


app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use('/api/contents', contentRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);


module.exports = app;