import db from "../../loaders/database";
const { QueryTypes } = require('sequelize');

export default class ProductRepository {
  constructor() {
    this.db = db.sequelize;
  }


  async findAll() {
    const fetchAllProductsQuery = await this.db.query('SELECT * from Products',
    { type: QueryTypes.SELECT}).catch(err => console.error(err))
    return fetchAllProductsQuery;
  }

  async getAllProducts() {
    let allPizzas   = await this.findAll()
    return allPizzas;
  }

}