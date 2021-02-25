'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // CartItem belongsTo Cart
    return queryInterface.addColumn(
      'CartItems', // Source model
      'cart_id',   // foreign key
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Carts', // Target model
          key: 'id', // primary key
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
    // CartItem hasMany products 
    .then(() => {
      return queryInterface.addColumn(
        'CartItems',
        'product_id',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Products',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )  
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'CartItems', // Source model
      'cart_id' // foreign key
    ).then(() => {
      'CartItems',
      'product_id'
    })
  }
};
