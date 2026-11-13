# Order Management API

Learning-focused REST API built with Node.js, Express, and MongoDB to practice backend development, CRUD operations, API documentation, containerization, and cloud deployment.

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
- Protect write operations using API-key authentication

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

This endpoint requires a valid API key in the x-api-key HTTP header. The API stores the order in MongoDB and returns the created document with a `201 Created` response.

The `status` field defaults to `Pending` if omitted.

## Running Locally

### Prerequisites

- Node.js 24
- npm
- A MongoDB Atlas cluster and database user with appropriate access

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/eportah/Order-Management-API.git
   cd Order-Management-API
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Create a `.env` file in the project root and configure the MongoDB connection:

   ```dotenv
   MONGO_URI=<your-own-mongodb-connection-string>
   WRITE_API_KEY=<your-own-generated-api-key>
   ```
   Replace placeholders with your own Atlas database credentials and cluster hostname. Ensure your IP address is permitted in Atlas Network Access. Generate a random API key and assign it to WRITE_API_KEY, which is required for POST, PATCH, and DELETE requests when running your own instance of the API.

4. Start the application:

   ```bash
   node --env-file=.env index.js
   ```

5. Access the API:

   - API: `http://localhost:3000/orders`
   - Swagger UI: `http://localhost:3000/api-docs`

Uses port `3000` by default, or the `PORT` environment variable when provided.

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
- `401 Unauthorized` — Missing or invalid API key for a write operation
- `404 Not Found` — Requested order does not exist
- `500 Internal Server Error` — Unexpected server failure

## Demo Access and Security

The hosted API is intended for demonstration using dummy data.

The GET endpoints are publicly accessible. Creating, updating, and deleting orders require an API key supplied through the `x-api-key` HTTP header.

Demonstration-level access control, not a production authentication system.

## Free-Tier Availability

Render may spin down the web service after 15 minutes of inactivity, causing the first request to take longer while the service restarts.

MongoDB Atlas may automatically pause an inactive Free cluster after 30 days without database connections. A paused cluster must be manually resumed.

The hosted demo may occasionally be unavailable due to free-tier inactivity.

## Cloud Deployment

Deployed on Render using Docker and connects to a MongoDB Atlas database.

- **API Endpoint:** https://order-management-api-apk3.onrender.com/orders
- **Swagger Documentation:** https://order-management-api-apk3.onrender.com/api-docs

Uses environment variables to configure its MongoDB connection without exposing credentials in the source code.

This deployment uses dummy test data.

## Project Scope

Focuses on fundamental backend development concepts and cloud deployment. Uses API-key authentication to protect write operations but does not implement user accounts, role-based access control, payment processing, or other features expected in a production order management system.

## License

MIT license