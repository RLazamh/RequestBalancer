
# EXSquared GraphQL Service

This repository contains the solution for EXSquared LATAM’s vehicle data service using GraphQL. It fetches vehicle data from external APIs, processes it, caches the results in Redis, and exposes it via a GraphQL API. It also includes scheduling for periodic data processing and robust error handling.

#### Running the Application with Docker ####

1. **Create and Build Docker Containers**

   To build and run the Docker containers, use the following command:
   ```bash
   npm run docker:create
   ```

2. **Start the Docker Containers**

   If the containers are already created, you can start them with:
   ```bash
   npm run docker:start
   ```

- The application will be available at: [http://localhost:3000/graphql](http://localhost:3000/graphql)

#### Running Locally ####

To run the project locally without Docker:

1. **Install Dependencies**

   Make sure to install all dependencies:
   ```bash
   npm install
   ```

2. **Run the Application**

   Start the application in development mode:
   ```bash
   npm run start:dev
   ```

- The GraphQL Playground will be available at: [http://localhost:3000/graphql](http://localhost:3000/graphql)
 
## Technologies Used

The following technologies have been used to ensure robust functionality:

- **NestJS**: A Node.js framework that helps structure the project with modules, services, and resolvers.
- **GraphQL**: Used for querying vehicle data, allowing efficient and flexible data access.
- **Axios**: A promise-based HTTP client for fetching data from external APIs.
- **Redis**: Used for caching vehicle data to reduce API calls and improve performance.
- **RxJS**: A reactive programming library for handling HTTP responses and errors.
- **Jest**: A testing framework used to ensure the reliability of the code.

## Key Features

### 1. GraphQL Vehicle Data Query
The `VehicleResolver` allows users to query vehicle data with pagination. It interacts with Redis for caching and Axios for fetching data from external APIs.

### 2. Scheduled Data Processing
Using NestJS's scheduling module, the service periodically fetches and processes vehicle data from an XML API every 3 hours. The processing is initialized via a cron job.

### 3. Error Handling
The project implements robust error handling mechanisms for failed HTTP requests or data retrieval, with clear logging for debugging.

### Example GraphQL Query

```graphql
query GetVehicles($limit: Int, $page: Int) {
  vehicles(limit: $limit, page: $page) {
    makeId
    makeName
    vehicleTypes {
      typeId
      typeName
    }
  }
}
```

- **Query Example:**

```json
{
  "query": "query ($limit: Int, $page: Int) { vehicles(limit: $limit, page: $page) { makeId makeName vehicleTypes { typeId typeName } } }",
  "variables": {
    "limit": 100,
    "page": 1
  }
}
```

## Scripts Overview

The project includes various npm scripts to assist in development and deployment:

- **start**: Runs the application in production mode using `node dist/main`.
- **start:dev**: Runs the application in development mode with automatic file watching and restarts.
- **test**: Executes unit tests using Jest.
- **test:cov**: Runs unit tests and generates a code coverage report.

### Running Tests

- **To run unit tests**:
  ```bash
  npm run test
  ```

- **To run unit tests with coverage**:
  ```bash
  npm run test:cov
  ```

## Port Information

| Service    | Description                    | Port         |
|------------|--------------------------------|--------------|
| Application| GraphQL API (Container)        | 4000         |
| Redis      | Redis Cache (Container)        | 6379         |

The application will be available at:
- Docker: [http://localhost:4050/graphql](http://localhost:4050/graphql)
- Local: [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Endpoints Overview

| HTTP Method | Endpoint         | Description                                 |
|-------------|------------------|---------------------------------------------|
| POST        | `/graphql`       | Exposes GraphQL queries for vehicle data.   |

## Initialization on Startup

The project includes a startup process defined in the `VehicleResolver` class, which triggers an initial data fetch if the environment is set to 'dev'. This is done via the `onModuleInit()` method and ensures that the system starts with fresh vehicle data.
  
## License

All rights reserved © 2024 Roger Laza. Unauthorized use, distribution, or reproduction of any part of this material is strictly prohibited.