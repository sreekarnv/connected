const express = require('express');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');

const errorController = require('./controllers/errorController');

app = express();

app.enable('trust proxy');
app.use(cors());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Security Headers
app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);

app.use(cookieParser());

// Rate Limit
const limiter = rateLimit({
	max: 1000,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests fromt IP, please try again in an hour',
});

app.use('/api', limiter);

// API Routess
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const groupRoutes = require('./routes/groupRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// setting https headers
app.use(cookieParser());
app.use(express.json());

// cleaning malicious Data against NoSQL query injections
app.use(mongoSanitize());

// cleaning malicious Data aganinst XSS
app.use(xss());

app.use('/', express.static(path.join(__dirname, 'frontend/build')));

app.use(
	'/uploads/users',
	express.static(path.join(__dirname, 'uploads', 'users'))
);

app.use(
	'/uploads/groups',
	express.static(path.resolve(__dirname, 'uploads', 'groups'))
);

app.use(
	'/uploads/posts',
	express.static(path.resolve(__dirname, 'uploads', 'posts'))
);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.use((req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'frontend/build/index.html'));
});

app.use(errorController);

module.exports = app;
