import expressLoader from './express';

export default async ({ expressApp }) => {
  const db = require('./database');
  await db.sequelize.authenticate()
  .then(() => console.info(`✌️   Database loaded`))
  .catch(err => console.error(`⚠️  Could not load up database  ⚠️`, err))
  expressLoader({ app: expressApp })
  console.info(`✌️   Express loaded`);
};