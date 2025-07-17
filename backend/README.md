# README.md

# Physiology App Backend

This is the backend for the Physiology App, built using TypeScript, Express, CORS, and SQLite3.

## Project Structure

```
backend
├── src
│   ├── db
│   │   └── index.ts        # Handles database connections and queries
│   ├── routes
│   │   └── index.ts        # Sets up API routes
│   └── server.ts           # Entry point of the application
├── package.json             # npm configuration file
├── tsconfig.json            # TypeScript configuration file
└── README.md                # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd physiology-app/backend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Compile TypeScript files:**
   ```
   npx tsc
   ```

4. **Run the server:**
   ```
   node dist/server.js
   ```

## Usage

Once the server is running, you can access the API at `http://localhost:8000`. 

## API Endpoints

- `GET /`: Returns a simple message indicating the API is working.

## License

This project is licensed under the ISC License.