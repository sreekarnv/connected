const multer = require('multer');
const AppError = require('../utils/AppError');

const multerMemoryStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('please upload images only', 400), false);
	}
};

const imageUpload = multer({
	storage: multerMemoryStorage,
	fileFilter: multerFilter,
});


module.exports = imageUpload;
