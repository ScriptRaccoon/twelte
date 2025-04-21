import { CLOUDINARY_API_SECRET } from '$env/static/private'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
	cloud_name: 'dn9qxvfdr',
	api_key: '338696735644498',
	api_secret: CLOUDINARY_API_SECRET
})

const AVATAR_FOLDER = 'twelte/uploads/avatars'
const AVATAR_SIZE = 100

export async function upload_avatar(user_id: number, file: File): Promise<string> {
	const arrayBuffer = await file.arrayBuffer()
	const buffer = Buffer.from(arrayBuffer)

	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				resource_type: 'auto',
				folder: AVATAR_FOLDER,
				public_id: `user_${user_id}`,
				overwrite: true,
				format: 'webp',
				transformation: [{ width: AVATAR_SIZE, height: AVATAR_SIZE, crop: 'fill' }]
			},
			(error, result) => {
				if (error) {
					reject(error)
				} else {
					const url = result?.secure_url ?? ''
					resolve(url)
				}
			}
		)

		uploadStream.end(buffer)
	})
}
