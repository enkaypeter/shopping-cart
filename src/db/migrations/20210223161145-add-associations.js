'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // CartItem belongsTo Cart
    return queryInterface.addColumn(
      'cartItems', // Source model
      'cartId',   // foreign key
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
        'cartItems',
        'productId',
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
      'cartItems', // Source model
      'cartId' // foreign key
    ).then(() => {
      'cartItems',
      'productId'
    })
  }
};
