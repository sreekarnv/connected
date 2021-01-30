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

exports.app1 = express();
exports.app2 = express();

this.app1.enable('trust proxy');

this.app1.use(cors());

if (process.env.NODE_ENV === 'development') {
	this.app1.use(morgan('dev'));
}

// Security Headers
this.app1.use(
	helmet({
		contentSecurityPolicy: false,
	})
);

this.app1.use(cookieParser());

// Rate Limit
const limiter = rateLimit({
	max: 1000,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests fromt this IP, please try again in an hour',
});

this.app1.use('/api', limiter);

// API Routess
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const groupRoutes = require('./routes/groupRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// setting https headers
this.app1.use(cookieParser());
this.app1.use(express.json());

// cleaning malicious Data against NoSQL query injections
this.app1.use(mongoSanitize());

// cleaning malicious Data aganinst XSS
this.app1.use(xss());

this.app1.use('/', express.static(path.join(__dirname, 'frontend/build')));

this.app2.use(
	'/uploads/users',
	express.static(path.resolve(__dirname, 'uploads', 'users'))
);

this.app2.use(
	'/uploads/groups',
	express.static(path.resolve(__dirname, 'uploads', 'groups'))
);

this.app2.use(
	'/uploads/posts',
	express.static(path.resolve(__dirname, 'uploads', 'posts'))
);

this.app1.use('/api/v1/users', userRoutes);
this.app1.use('/api/v1/groups', groupRoutes);
this.app1.use('/api/v1/posts', postRoutes);
this.app1.use('/api/v1/comments', commentRoutes);
this.app1.use('/api/v1/notifications', notificationRoutes);

this.app2.use((req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'frontend/build/index.html'));
});

this.app1.use(errorController);
