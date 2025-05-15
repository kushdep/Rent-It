const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const CLOUDINARY_NAME = 'demncxfgx'
const CLOUDINARY_KEY = 454338249136662
const CLOUDINARY_SECRET = 'OPjn9toPyGb5JaQrukVR5dYL_lM'

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_KEY,
    api_secret: CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Rent-IT',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})

const seedImg = async () => {
    const imageUrls = [];
    for (let i = 0; i < 50; i++) {
        imageUrls.push(`https://picsum.photos/400?random=${Math.random()}`)
    }

    const uploadPromises = imageUrls.map(url => {
        return cloudinary.uploader.upload(url, {
            folder: 'Rent-IT'
        });
    });
    try {
        const results = await Promise.all(uploadPromises);
        const UploadImages = results.map(f => ({ url: f.url, filename: f.public_id }))
        console.log(results)
        console.log(UploadImages)
    } catch (error) {
        console.log(error)
    }

}

// const data = results.map(r => r.secure_url)

module.exports = {
    storage,
    cloudinary
}


