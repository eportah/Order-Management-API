const{ timingSafeEqual } = require('node:crypto');
const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// if env variable is missing, write requests are rejected automatically (failing closed)
function requireWriteApiKey(req, res, next){
  // req.get('x-api-key') retrieves key supplied by Postman or another client
  const expectedKey = process.env.WRITE_API_KEY;
  const providedKey = req.get('x-api-key');

  // 401 unauthorized rejects requests without a valid key
  if(!expectedKey || !providedKey){
    return res.status(401).json({error: 'Valid API key required'});
  }

  const expected = Buffer.from(expectedKey);
  const provided = Buffer.from(providedKey);

  // timingSafeEqual() compares 2 values without leaking info through string-comparison timing differences
  if(
    expected.length !== provided.length ||
    !timingSafeEqual(expected, provided)
  ){
    return res.status(401).json({error: 'Valid API key required'});
  }

  // allows authenticated request to continue to existing endpoint handler
  next();
}

// routes for orders

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     writeApiKey:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 *       description: Required for creating, updating, and deleting orders.
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: '966a3df3989514b20f0df414'
 *         customerName:
 *           type: string
 *           example: 'Jane Doe'
 *         items:
 *           type: array
 *           items:
 *             type: string
 *           example: ['Pencil', 'Eraser']
 *         totalAmount:
 *           type: number
 *           example: 25.99
 *         status:
 *           type: string
 *           example: 'Pending'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2020-05-10T15:00:00.000Z'
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     security:
 *       - writeApiKey: []
 *     summary: Create a new order
 *     description: Adds a new order document to the MongoDB database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - customerName
 *             - totalAmount
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: 'Jane Doe'
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['Pencil', 'Eraser']
 *               totalAmount:
 *                  type: number
 *                  example: 25.99
 *               status:
 *                  type: string
 *                  default: 'Pending'
 *                  example: 'Pending'
 *     responses:
 *       '201':
 *         description: Order successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       '400':
 *         description: Invalid order data
 *       '500':
 *         description: Internal server error
 */

// post, create new order
router.post('/',requireWriteApiKey, async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    if (err.name === 'ValidationError'){
        return res.status(400).json({ error: err.message });
    }

    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Internal server error'});
  }
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve all orders
 *     description: Fetches all order documents, or an empty array when none exist.
 *     responses:
 *       '200':
 *         description: A successful response returning an array of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       '500':
 *         description: Internal server error
 */

// get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    console.log('GET request received for all orders');
    res.json(orders);
  } catch (err) {
    console.error('Error retrieving orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     description: Retrieves one order using its MongoDB document ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ID of the order
 *     responses:
 *       '200':
 *         description: A successful response returning the order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       '400':
 *         description: Invalid order ID
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Internal server error
 */

// get a specific order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    if (err.name === 'CastError'){
        return res.status(400).json({error: 'Invalid order ID'});
    }

    console.error('Error retrieving order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     security:
 *       - writeApiKey: []
 *     summary: Update an order's status
 *     description: Modifies an existing order using its database ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 minLength: 1
 *                 example: 'Completed'
 *     responses:
 *       '200':
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       '400':
 *         description: Invalid order ID or status
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Server error
 */

// patch: update order status
router.patch('/:id', requireWriteApiKey, async (req, res) => {
  try {
    if (!req.body || typeof req.body.status !== 'string' || !req.body.status.trim()){
        return res.status(400).json({error: 'Valid status is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status;

    const updateOrder = await order.save();
    res.json(updateOrder);
  } catch (err) {
    if (err.name === 'CastError'){
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    if (err.name === 'ValidationError'){
        return res.status(400).json({ error: err.message });
    }

    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     security:
 *       - writeApiKey: []
 *     summary: Delete an order
 *     description: Removes an order document from the MongoDB database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ID of the order to delete
 *     responses:
 *       '200':
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                  type: string
 *                  example: 'Order deleted successfully'
 *       '400':
 *         description: Invalid order ID
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Internal server error
 */

// delete an order
router.delete('/:id', requireWriteApiKey, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError'){
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    console.error('Error deleting order:', err);
    res.status(500).json({error: 'Internal server error'});
  }
});

module.exports = router;