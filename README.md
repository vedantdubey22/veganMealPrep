# IMPORTANT: Backend Technology Policy

**This project must only use Java and Spring Boot for all backend functionality.**

**Node.js and Express must NEVER be used for any backend code or features.**

# Vegan Meal Prep Tracker

A web application for tracking vegan meals and nutritional intake, built with React.js and Spring Boot.

## Features

- Track daily vegan meals and nutritional intake
- Real-time calorie and macronutrient calculations
- Integration with Spoonacular API for accurate nutritional data
- Vegan-friendly food filtering
- Responsive and modern UI with Tailwind CSS
- Secure backend API handling with Spring Boot
- MongoDB integration for data persistence

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios for API calls

### Backend
- Spring Boot
- MongoDB
- Spoonacular API integration

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Java JDK 17
- Maven
- MongoDB
- Spoonacular API key

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your Spoonacular API key:
   ```
   REACT_APP_SPOONACULAR_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Update `application.properties` with your MongoDB and Spoonacular API credentials
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

## API Documentation

The application uses the following main endpoints:

- `GET /api/food/search` - Search for vegan food items
- `POST /api/meals` - Add a new meal
- `GET /api/meals/daily` - Get daily meal summary
- `GET /api/nutrition/calculate` - Calculate nutrition for a meal

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 