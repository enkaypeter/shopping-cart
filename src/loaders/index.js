import expressLoader from './express';

export default async ({ expressApp }) => {
  expressLoader({ app: expressApp })
  console.info(`✌️   Express loaded`);

  const db = require('./database');
  await db.sequelize.authenticate()
  .then(() => console.info(`✌️   Database loaded`))
  .catch(err => console.error(`⚠️  Could not load up database  ⚠️`, err))

};