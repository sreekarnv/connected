import { NextFunction, Response } from 'express';
import { IRequest } from '../types';
import AppError from '../utils/AppError';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from 'cloudinary';
import path from 'path';
import sharp from 'sharp';

export const resizeImage = (folderName: string) => {
	return async (req: IRequest, _: Response, next: NextFunction) => {
		if (!req.file) return next();

		const {
			height,
			width,
			x: left,
			y: top,
		} = JSON.parse(req.body.imageSettings);
		req.file.filename = `${uuidv4()}.jpeg`;

		try {
			await sharp(req.file.buffer)
				.extract({
					left: parseInt(left),
					top: parseInt(top),
					width: parseInt(width),
					height: parseInt(height),
				})
				.resize(1000, 1000)
				.toFormat('jpeg')
				.jpeg({ quality: 90 })
				.toFile(path.join(__dirname, '../../uploads', req.file.filename));

			cloudinary.v2.config({
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_API_SECRET,
			});

			const uploadedImg = await cloudinary.v2.uploader.upload(
				`uploads/${req.file.filename}`,
				{
					resource_type: 'image',
					use_filename: true,
					folder: `${process.env.CLOUDINARY_FOLDER_NAME}/${folderName}`,
					allowed_formats: ['jpeg'],
				}
			);

			req.photo = {
				publicId: uploadedImg.public_id,
				url: uploadedImg.secure_url,
				name: uploadedImg.original_filename,
				signature: uploadedImg.signature,
			};

			next();
		} catch (_) {
			return next(
				new AppError('error uploading your image. Please try later', 400)
			);
		}
	};
};
