import  Validator from "validatorjs";
import ProductRepository from "../repositiories/products";
import CartRepository from "../repositiories/cart";

const productRepo = new ProductRepository();
const numeric = function (val) {
  let num;

  num = Number(val);
  if (typeof num === "number" && !isNaN(num) && typeof val !== "boolean") {
    return true;
  } else {
    return false;
  }
}

Validator.registerAsync('is_exists', async (value,  attribute, data, passes) => {
  let msg = `${data} does not exists.`;
  if(numeric(value) == false ){
    msg = `${value} should be a number.`
    passes(false, msg);
    return;
  };

  let getModelName = data.split("_id")[0];
  if(getModelName == "cart"){
    const cartRepo = new CartRepository();
    let singleCart = await cartRepo.getCartById(value);
    singleCart !== undefined ? passes() : passes(false, msg);
  } else if (getModelName == "product") {
    let singleProduct = await productRepo.getById(value);  
    singleProduct !== undefined ? passes() : passes(false, msg); // return false if product is not found
  }
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
  switch (data) {
    case 'price':
      msg = `${data} has changed and is now ${singleProduct.price}`
      singleProduct.price != value ? passes(false, msg) : passes();
      return;  
    case 'sku': 
      msg = `${data} is invalid. Please check and try again`
      singleProduct.sku != value ? passes(false, msg) : passes();
      return;
    default:
      passes(false)
      break;
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