const express = require('express');
const mongoose = require('mongoose');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const ordersRoute = require('./routes/orders');

// initialize express and configure server port
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// order routes
app.use('/orders', ordersRoute);

// swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
        title: 'Order Management API',
        version: '1.0.0',
        description: 'An educational REST API for managing orders.',
    },
     servers: [{ url: '/' }],
    },
    apis: ['./routes/*.js'],
   };

   const swaggerDocs = swaggerJSDoc(swaggerOptions);
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});