const User = require('../models/userModel');
const AppError = require('./../utils/AppError');
const { signToken, decodeToken } = require('./../utils/jwt');

/////////////////////////////////////////////////////
// register user
exports.registerUser = async (req, res, next) => {
	try {
		if (req.file && req.photo) {
			user.photo = req.photo;
		}

		const {
			firstName,
			middleName,
			lastName,
			email,
			password,
			passwordConfirm,
			photo,
		} = req.body;

		const user = await User.create({
			firstName,
			middleName,
			lastName,
			email,
			password,
			passwordConfirm,
			photo,
		});

		res.status(201).json({
			status: 'success',
		});
	} catch (err) {
		next(err);
	}
};

///////////////////////////////////////////////////////
// login user

exports.loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return next(new AppError('please enter your credentials', 400));
		}

		const user = await User.findOne({ email })
			.select('+password')
			.populate('friends');

		if (!user || !(await user.checkPassword(password, user.password))) {
			return next(new AppError('invalid credentials', 400));
		}

		let token = await signToken({ id: user._id }, req, res);

		user.hideSensitiveData(user);

		res.status(200).json({
			token,
			status: 'success',
			user,
		});
	} catch (err) {
		next(err);
	}
};

/////////////////////////////////////////////////////////////////////
// Logout User

exports.logoutUsers = async (req, res, next) => {
	try {
		res.clearCookie('connected');

		res.status(200).json({
			status: 'success',
			user: null,
		});
	} catch (err) {
		next(err);
	}
};

/////////////////////////////////////////////////////////////////////
// Protect Api routes

exports.protectRoutes = async (req, res, next) => {
	try {
		let authToken;
		if (req.cookies.connected) {
			authToken = req.cookies.connected;
		} else if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			authToken = req.headers.authorization.split(' ')[1];
		}

		const { id, iat, exp } = await decodeToken(authToken);

		const user = await User.findById(id)
			.select('+passwordChangedAt')
			.populate('friends');

		if (!user || !user.checkJwtExpires(iat, exp)) {
			return next(
				new AppError('you are not authorized. please login to continue', 401)
			);
		}

		if (user.checkPasswordChangedAt(iat, exp, user.passwordChangedAt)) {
			return next(
				new AppError(
					'you recently changed your password. please login to continue',
					401
				)
			);
		}

		user.hideSensitiveData(user);

		req.user = user;

		next();
	} catch (err) {
		next(err);
	}
};

/////////////////////////////////////////////////////////////////////
// Check if user is logged in

const noUser = (req, res, next) => {
	res.status(200).json({
		status: 'success',
		user: null,
	});
};

exports.checkIsLoggedIn = async (req, res, next) => {
	try {
		// 1. get Authtoken and check if it exists
		let token = req.cookies.connected;

		if (!token) {
			return noUser(req, res, next);
		}

		// 2. Verfiy and get decoded values
		const { id } = await decodeToken(token);

		// 3. Get User and check if user exists
		const user = await User.findById(id).populate('friends');

		if (!user) {
			return noUser(req, res, next);
		}

		user.hideSensitiveData(user);

		// 5. Grant access
		res.status(200).json({
			status: 'success',
			user,
		});
	} catch (err) {
		next();
	}
};

/////////////////////////////////////////////////////////////////////
// Update Current User Password

exports.updateUserPassword = async (req, res, next) => {
	try {
		let id = req.user.id;

		const { currentPassword, password, passwordConfirm } = req.body;

		const user = await User.findById(id)
			.select('+password')
			.populate('friends');

		if (!(await user.checkPassword(currentPassword, user.password))) {
			return next(new AppError('invalid password', 400));
		}

		user.password = password;
		user.passwordConfirm = passwordConfirm;
		await user.save();

		user.hideSensitiveData(user);

		res.status(200).json({
			status: 'success',
			user,
		});
	} catch (err) {
		next(err);
	}
};
