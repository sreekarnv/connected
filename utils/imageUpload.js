const multer = require('multer');
const AppError = require('./AppError');

const storageMem = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('please upload images only', 400), false);
	}
};

module.exports = multer({
	storage: storageMem,
	fileFilter: multerFilter,
});
