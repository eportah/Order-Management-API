# Order Management API

A learning-focused REST API built with Node.js, Express, and MongoDB to practice backend development, CRUD operations, API documentation, containerization, and cloud deployment.

This project provides a simple API for creating, retrieving, updating, and deleting sample orders. It is intended as an educational demonstration rather than a production-ready order management system.

## Technologies Used

- **Node.js** — JavaScript runtime for the backend application
- **Express.js** — HTTP routing, middleware, and request handling
- **MongoDB Atlas** — Cloud-hosted database for storing orders
- **Mongoose** — MongoDB object modeling and schema validation
- **Swagger / OpenAPI** — Interactive API documentation
- **Postman** — Manual testing of API endpoints
- **Docker** — Containerization of the application
- **Render** — Cloud hosting platform for deployment

## Features

- Create new orders with customer information, items, and a total amount
- Retrieve all stored orders or an individual order by ID
- Update an existing order's status
- Delete orders
- Validate required fields and prevent negative order totals
- Return appropriate HTTP status codes for successful and unsuccessful requests
- Explore and test endpoints through Swagger UI

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders` | Create a new order |
| GET | `/orders` | Retrieve all orders |
| GET | `/orders/:id` | Retrieve an order by ID |
| PATCH | `/orders/:id` | Update an order's status |
| DELETE | `/orders/:id` | Delete an order |

### Example Request

**POST `/orders`**

```json
{
  "customerName": "Jane Doe",
  "items": ["Notebook", "Pen"],
  "totalAmount": 25.99,
  "status": "Pending"
}
```

The API stores the order in MongoDB and returns the created document with a `201 Created` response.

The `status` field defaults to `Pending` if omitted.

## Running Locally

### Prerequisites

- Node.js 24
- npm
- A MongoDB Atlas cluster and database user with appropriate access

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/eportah/order-management-api.git
   cd order-management-api
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Create a `.env` file in the project root and configure the MongoDB connection:

   ```dotenv
   MONGO_URI=mongodb+srv://<username>:<password>@orders-api-cluster.h7hgnkl.mongodb.net/orders_api
   ```
   Replace the placeholders with your own Atlas database credentials and cluster hostname. Ensure your IP address is permitted in Atlas Network Access. Do not commit your `.env` file.

4. Start the application:

   ```bash
   node --env-file=.env index.js
   ```

5. Access the API:

   - API: `http://localhost:3000/orders`
   - Swagger UI: `http://localhost:3000/api-docs`

The application uses port `3000` by default, or the `PORT` environment variable when provided.

## Running with Docker

Build the Docker image:

```bash
docker build -t order-management-api .
```

Run the container with your local environment file:

```bash
docker run --env-file .env -p 3000:3000 order-management-api
```

The API is then accessible at `http://localhost:3000/orders`.

## API Documentation and Testing

Swagger UI provides interactive documentation for all five endpoints at `/api-docs`.

Postman was used to manually verify CRUD operations, successful responses, validation errors, and missing-resource handling.

The API uses standard HTTP response codes, including:

- `200 OK` — Successful retrieval, update, or deletion
- `201 Created` — Order created successfully
- `400 Bad Request` — Invalid request data or order ID
- `404 Not Found` — Requested order does not exist
- `500 Internal Server Error` — Unexpected server failure

## Demo Access and Security

The hosted API is intended for educational demonstration using synthetic order data.

The GET endpoints are publicly accessible. Creating, updating, and deleting orders require an API key supplied through the `x-api-key` HTTP header.

The API key is stored as an environment variable and is not included in the repository.

This is a demonstration-level access control mechanism, not a production authentication system.

## Free-Tier Availability

This project uses free-tier hosting through Render and MongoDB Atlas.

Render may spin down the web service after 15 minutes of inactivity, causing the first request to take longer while the service restarts.

MongoDB Atlas may automatically pause an inactive Free cluster after 30 days without database connections. A paused cluster must be manually resumed.

Consequently, the hosted demo may occasionally be unavailable due to free-tier inactivity.

## Cloud Deployment

The API is deployed on Render using Docker and connects to a MongoDB Atlas database.

- **API Endpoint:** https://order-management-api-apk3.onrender.com/orders
- **Swagger Documentation:** https://order-management-api-apk3.onrender.com/api-docs

The application uses environment variables to configure its MongoDB connection without exposing credentials in the source code.

This deployment is intended for educational demonstration and uses synthetic test data.

## Project Scope

This project focuses on fundamental backend development concepts and cloud deployment.

It does not implement user authentication, authorization, payment processing, or other features expected in a production order management system. Use synthetic test data rather than real customer information.

## License

No open-source license has been assigned to this project.