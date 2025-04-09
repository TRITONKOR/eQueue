# eQueue

eQueue is a web application designed to streamline queue management and improve user experience. This project is built using modern web technologies.

## Features

- User-friendly interface for managing services and profiles.
- Integration with external APIs for data handling.
- Responsive design for optimal usability on various devices.

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, SCSS
- **Routing**: React Router
- **State Management**: React Context API
- **UI Components**: HeroUI

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/eQueue.git
   cd eQueue

2. Install dependencies:

   ```bash

   npm install

3. Set up environment variables:
    Create a .env file in the root directory and add the following:

   ```bash

   VITE_API_URL=https://elreg.rada-uzhgorod.gov.ua
   VITE_API_HOST=elreg.rada-uzhgorod.gov.ua
   VITE_ORGANIZATION_GUID=4c750754-aa83-410c-8a7f-55d71233380a

### Running the Application

Start the development server:

   ```bash
   npm run dev
   ```
The application will be available at http://localhost:5173.

### Building for Production

To build the application for production:

   ```bash
   npm run build
   ```
The production-ready files will be in the dist directory.

##Folder Structure

  ```bash
  eQueue/
├── src/
│   ├── components/       # Reusable components
│   ├── context/          # Context API for state management
│   ├── pages/            # Application pages
│   ├── styles/           # Global styles and SCSS files
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── .env                  # Environment variables
├── [package.json](http://_vscodecontentref_/1)          # Project configuration
└── [README.md](http://_vscodecontentref_/2)             # Project documentation
```
