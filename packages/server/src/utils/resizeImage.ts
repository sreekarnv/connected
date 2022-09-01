import { NextFunction, Response } from 'express';
import { IRequest } from '../types';
import AppError from '../utils/AppError';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from 'cloudinary';
import path from 'path';
import sharp from 'sharp';
import { createReadStream } from 'fs';

export const resizeImage = (folderName: string) => {
	return async (req: IRequest, res: Response, next: NextFunction) => {
		if (!req.file) return next();

		const {
			height,
			width,
			x: left,
			y: top,
		} = JSON.parse(req.body.imageSettings);
		req.file.filename = `${uuidv4()}.jpeg`;

		try {
			const image = await sharp(req.file.buffer)
				.extract({
					left: parseInt(left),
					top: parseInt(top),
					width: parseInt(width),
					height: parseInt(height),
				})
				.resize(1000, 1000)
				.toFormat('jpeg')
				.jpeg({ quality: 90 })
				.toBuffer();

			cloudinary.v2.config({
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_API_SECRET,
			});

			cloudinary.v2.uploader
				.upload_stream(
					{
						resource_type: 'image',
						use_filename: true,
						folder: `${process.env.CLOUDINARY_FOLDER_NAME}/${folderName}`,
						allowed_formats: ['jpeg'],
					},
					(error, result) => {
						if (error) {
							return next(new AppError(error.message, 500));
						}

						if (result) {
							req.photo = {
								publicId: result.public_id,
								url: result.secure_url,
								name: result.original_filename,
								signature: result.signature,
							};

							next();
						}
					}
				)
				.end(image);
		} catch (err) {}
	};
};
