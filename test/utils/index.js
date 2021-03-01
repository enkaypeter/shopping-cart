import db from "../../src/loaders/database";
import productsData from "./partials/products.data";
import CartRepository from "../../src/api/repositiories/cart";

const cartRepository = new CartRepository()
const { carts, cartItems, products } = db;

const truncateTable =  (modelName) => {
  modelName.destroy({
    where: {},
    force: true,
  })
};

const truncate  = async (model) => {
  if (model) {
    return truncateTable(model);
  }
  await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true }); // do not check referential constraints
  return Promise.all(
    Object.keys(models).map((key) => {
      if (['sequelize', 'Sequelize'].includes(key)) return null;
      return truncateTable(key);
    })
  );
}

module.exports = {
  clearDatabase: async () => {
    await truncate(cartItems)
    await truncate(carts)
    await truncate(products)

    db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true }); 
  },

  closeDatabaseConnection: async () => {
    db.sequelize.close();
  },

  seedProductsTable: async () => {
    await products.bulkCreate(productsData).catch(err => {
      throw new Error ("There was a problem seeding products table")
    })
    console.log("products table seeded!")
  },

  seedCartItem: async() => {
    try {
      let createCartItem = await carts.create({
        first_name: "john",
        last_name:"doe",
        email: "johndoe@domain.com",
        created_at: new Date()
      });
  
      if(createCartItem !== null ){
        let cartId = createCartItem.id;        
        const addToCartPayload = {
          cartId,
          productId: 2,
          quantity: 5,
          sku: "RD-CNV-43",
          price: 250.00
        };
  
        await cartRepository.saveCartItems(addToCartPayload);
        console.log("cart items seeded!")

      }      
    } catch (error) {
      console.log(error);
      throw new Error ("There was a problem seeding cart items");
    }
  }
}