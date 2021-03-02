# Basket - Shopping Cart API
![title](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a78ed276-b29b-4bd5-a510-cc62b0181cd6/basket_flow.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210302%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210302T144205Z&X-Amz-Expires=86400&X-Amz-Signature=15835b7639ce6a37422d5deb95b6249551ad23862747a829916205a7681040a0&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22basket_flow.png%22)

[View Technical Spec document](https://www.notion.so/enkay/Technical-Specification-Shopping-Cart-Basket-13bb9c4d97cf40e2bca908e68e076824#318147d5e6814a5f82a8fb77d8e893f6)

### Install dependencies
```bash
$ yarn
```
## Create database
```bash
$ npx sequelize db:create
```
### Run migrations
```bash
$ npx sequelize db:migrate
```

### Seed database
```bash
$ npx sequelize-cli db:seed:all
```

### Serve with hot reload
```bash
$ yarn start:dev
```

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/2152499/TWDfCt6D)