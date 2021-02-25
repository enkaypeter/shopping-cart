import  Validator from "validatorjs";
import ProductRepository from "../repositiories/products";

const productRepo = new ProductRepository();
const numeric = function (val) {
  let num;

  num = Number(val); // tries to convert value to a number. useful if value is coming from form element
  if (typeof num === "number" && !isNaN(num) && typeof val !== "boolean") {
    return true;
  } else {
    return false;
  }
}

Validator.registerAsync('is_exists', async (value,  attribute, data, passes) => {
  let msg = `product_id does not exists.`;
  if(numeric(value) == false ){
    msg = `${value} should be a number.`
    passes(false, msg);
    return;
  };
  let singleProduct = await productRepo.getById(value);  
  singleProduct !== undefined ? passes() : passes(false, msg); // return false if product is not found
});

Validator.register("is_decimal", (value, requirement, attribute) => {
  return /^[0-9]+(?:\.[0-9]{1,2})?$/.test(value);
}, ":attribute should be decimal")

Validator.registerAsync("is_valid", async (value, attribute, data, passes) => {
  let msg;
  if(attribute == 'undefined'){
    passes(false);
    return;
  }

  const productId = attribute;
  const singleProduct = await productRepo.getById(productId);
  singleProduct == undefined ? passes(false) : singleProduct;
  
  if(singleProduct.price != value){
    msg = `${data} has changed and is now ${singleProduct.price}`;
    passes(false, msg);
    return;
  }
  passes();

})

Validator.registerAsync("is_available", async (value, attribute, data, passes) => {
  let msg;
  if(attribute == 'undefined'){
    passes(false);
    return;
  }

  const productId = attribute;
  const singleProduct = await productRepo.getById(productId);
  singleProduct == undefined ? passes(false) : singleProduct;
  
  if(value > singleProduct.quantity){
    msg = `${data} requested is more than available inventory of ${singleProduct.quantity}`;
    passes(false, msg);
    return;
  }
  passes();

})

const validator = (data, rules, customMessages, callback) => {
  const validation = new Validator(data, rules, customMessages)
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

module.exports = validator;