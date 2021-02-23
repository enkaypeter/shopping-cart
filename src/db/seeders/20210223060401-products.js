'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('Products', [
      {
        name: 'Black Adidas Superstars 45',
        price: 350,
        sku: 'BK-ADS-45',
        category: 'shoes',
        quantity: 15,
        stock_level: 'in_stock',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Red Converse Allstars 43',
        price: 250,
        sku: 'RD-CNV-43',
        category: 'shoes',
        quantity: 25,
        stock_level: 'in_stock',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'White Nike Airmax 44',
        price: 300,
        sku: 'WH-NKE-44',
        category: 'shoes',
        quantity: 25,
        stock_level: 'in_stock',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Black Nike Kobe-AD 45',
        price: 450,
        sku: 'BK-NKE-45',
        category: 'shoes',
        quantity: 25,
        stock_level: 'in_stock',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Black Underarmour Currys 42',
        price: 450,
        sku: 'BK-UDA-42',
        category: 'shoes',
        quantity: 25,
        stock_level: 'in_stock',
        created_at: new Date(),
        updated_at: new Date()
      }

    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
