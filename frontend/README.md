# NoktaAtisi - Frontend

This is the frontend portion of the **NoktaAtisi** hackathon project, built with React and Vite.

## Overview
NoktaAtisi is an application where users can report missing products/services in their selected city. Sellers can then analyze demand based on location and category to make informed business decisions.

## Features
- **User Panel:** Allows users to select a city from a mock map of Turkey, choose a category, and submit what they feel is missing in that area.
- **Seller Panel:** Allows sellers to pick a target city and category, and analyze the market demand based on user submissions.
- **Modern UI:** Built with a clean, dark-mode aesthetic with glassmorphism effects.

## Setup Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the Vite development server by running:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Connecting with Backend

Ensure that your backend server is running on `http://localhost:3000`. The frontend uses this base URL to send requests (`POST /request`) and fetch analysis data (`GET /analyze`).

## Tech Stack
- React
- Vite
- React Router DOM
- CSS3 (Vanilla CSS with Custom Properties)
