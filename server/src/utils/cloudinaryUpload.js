const dotenv = require('dotenv')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

dotenv.config()
cloudinary.config({
    cloud_name: "dmz5jgq0x",
    api_key: "983225417512774",
    api_secret: "rsxOOLrhZt19zrG-84CxHAPQWeY"
})
const uploads = (buffer) =>{
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
      streamifier.createReadStream(buffer).pipe(stream);
    });
}
module.exports = uploads