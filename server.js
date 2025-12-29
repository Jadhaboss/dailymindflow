require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

// Static Files
app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes (Placeholders)
app.use('/', require('./routes/publicRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
