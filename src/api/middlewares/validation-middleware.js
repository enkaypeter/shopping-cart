const Validator = require('./validate');
const cartValidator = async (req, res, next) => {

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


module.exports = {
  cartValidator
}