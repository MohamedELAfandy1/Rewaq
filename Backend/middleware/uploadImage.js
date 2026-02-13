const multer = require("multer");
const apiError = require("../utils/apiError");


const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new apiError("Only images allowed", 400), false);
  }
};

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;


// exports.uploadSingleImage = (fieldName) => {
//   return multerOptions().single(fieldName);
// };

// exports.uploadMixOfImages = (arrayOfFields) => {
//   return multerOptions().fields(arrayOfFields);
// };
