module.exports = (req, res, next) => {
  if (!req.body) return next();
  // Arrays
  if (req.body.tags && typeof req.body.tags === "string") {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch (err) {
      req.body.tags = [];
    }
  }

//Numbers
   const numberFields = [
    "price",
    "priceAfterDiscount",
    "quantity",
    "sold",
  ];

  numberFields.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== "") {
      req.body[field] = Number(req.body[field]);
    }
  });

  //Boolean
  if (req.body.featured !== undefined) {
    req.body.featured =
      req.body.featured === true ||
      req.body.featured === "true";
  }

  //Cleanning
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      delete req.body[key];
    }
  });

  next();
};
