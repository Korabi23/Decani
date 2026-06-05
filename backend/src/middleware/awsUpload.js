const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      // 1. Marrim URL-në siç e diskutuam
      const pathParts = req.originalUrl.split("/");
      let folder = pathParts[3] || "uploads";
      
      // 2. Kujdes: Nëse folderi është i gabuar, e detyrojmë të jetë 'city-pictures' 
      // nëse request-i vjen nga ajo rrugë
      if (req.originalUrl.includes("city-pictures")) {
        folder = "city-pictures";
      }

      const fileName = `${folder}/${Date.now()}_${file.originalname}`;
      
      console.log("DEBUG - Duke ruajtur në S3:", fileName);
      cb(null, fileName);
    },
  }),
});

module.exports = upload;