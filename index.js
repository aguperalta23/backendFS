require('dotenv').config()
const express = require('express')
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json');
const cors = require('cors');
const bodyParser = require('body-parser');

// const swaggerUi = require('swagger-ui-express')
// const swaggerDocument = require('./swagger-output.json');

//Routers
// const loginRouter = require("./src/modules/login/login.routes");
// const reclamoRouter = require("./src/modules/claim/claim.routes");
const usuarioRouter = require("./src/modules/user/user.routes");
// const areaRouter = require("./src/modules/area/area.routes");
// const claimTypeRoute = require("./src/modules/claimType/claimType.routes");
// const auditRoute = require("./src/modules/audit/audit.routes");
// const notifyRoute = require("./src/modules/notify/notify.routes");
const productoRouter = require("./src/modules/product/product.routes");
// Secure setup
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');


const app = express()
const port = process.env.PORT


// Enable CORS
app.use(cors());

// Enable the use of request body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


mongoose.connect(
  process.env.DB_RECLAMO, { useNewUrlParser: true, useUnifiedTopology: true }
);

app.get("/", async (request, response) => {
      return response.send("Beckend reclamos node js express");
});
// Routers
// app.use(loginRouter);
// app.use(reclamoRouter);
app.use(usuarioRouter);
app.use(productoRouter);
// app.use(areaRouter);
// app.use(claimTypeRoute);
// app.use(auditRoute);
// app.use(notifyRoute);

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-UserId, X-Nonce' +
    ', X-Secret, X-Ts, X-Sig, X-Vendor-Sig, X-Vendor-Apikey, X-Vendor-Nonce, X-Vendor-Ts, X-ProfileId' +
    ', X-Authorization, Authorization, Token, Pragma, Cache-Control, Expires');
  res.header('Access-Control-Allow-Methods', 'HEAD,OPTIONS,GET,PUT,POST,DELETE');
  next();
});
var options = {
  explorer: true
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,options))
app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})