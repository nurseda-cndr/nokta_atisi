# NoktaAtisi

## Project Description

NoktaAtisi is a web platform designed for hackathons where users can report missing products or services in a specific city. Sellers and businesses can analyze this data to understand the demand based on location and category, helping them to target their offerings efficiently.

This project is built to be simple and hackathon-ready, featuring an in-memory data store for quick demonstration without the need to set up a database or authentication.

## Folder Structure

- `frontend/` - Contains the frontend web application (to be implemented).
- `backend/` - Node.js and Express backend API.
- `docs/` - Project documentation.

## How to Run Backend

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.


### Steps
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The backend server will run on `http://localhost:3000`.

### API Endpoints

- **`GET /health`**
  - Returns: `{ "status": "ok" }`

- **`POST /request`**
  - Input (JSON): `{ "city": "Istanbul", "category": "Transport", "message": "More metro lines needed" }`
  - Saves the request in memory.

- **`GET /analyze?city={city}&category={category}`**
  - Example: `GET /analyze?city=Istanbul&category=Transport`
  - Returns:
    ```json
    {
      "most_requested_message": "More metro lines needed",
      "demand_score": 3,
      "suggestion_text": "Moderate demand for: \"More metro lines needed\". Good opportunity for a targeted solution."
    }
    ```
