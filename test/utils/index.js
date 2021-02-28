import db from "../../src/loaders/database";
import productsData from "./partials/products.data";
const { carts, cartItems, products } = db;
module.exports = {
  clearDatabase: async () => {
    const destroyProps = {
      where: {},
      truncate: { 
        cascade: true 
      },
      force: true,
      restartIdentity: true,
    };

    await products.destroy(destroyProps);
    await cartItems.destroy(destroyProps);
    await carts.destroy(destroyProps);
  },

  closeDatabaseConnection: async () => {
    db.sequelize.close();
  },

  seedProductsTable: async () => {
    await products.bulkCreate(productsData).catch(err => {
      throw new Error ("There was a problem seeding products table")
    })
  }
}