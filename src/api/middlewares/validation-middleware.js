const Validator = require('./validate');
const addToCartValidator = async (req, res, next) => {

  //TODO: Remember to check if incoming object is an object or an array
  const validationRule = {
    "product_id": "required|numeric|is_exists",
    "quantity": `required|numeric|is_available:${req.body.product_id}`,
    "price": `required|is_decimal|is_valid:${req.body.product_id}`,
    "sku": `required|string|is_valid:${req.body.product_id}`
  };

  

  await Validator(req.body, validationRule, {}, (err, status) => {
    if(!status) {
      res.status(412)
      .send({
        message: 'validation failed',
        success: false,
        data: err
      });
    } else {
      next();
    }
  });
}

const updateCartValidator = async (req, res, next) => {

  const validationRule = {
    "cart_id": "required|numeric|is_exists",
    "product_id": "required|numeric|is_exists",
    "quantity": `required|numeric|is_available:${req.body.product_id}`,
  };
  

  await Validator(req.body, validationRule, {}, (err, status) => {
    if(!status) {
      res.status(412)
      .send({
        message: 'validation failed',
        success: false,
        data: err
      });
    } else {
      next();
    }
  });
}


module.exports = {
  addToCartValidator, updateCartValidator
}