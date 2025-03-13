# Funding Data Management Dashboard (MERN Stack)

## Overview
This project is a professional funding data management dashboard built using the MERN stack. It allows role-based access control, data visualization, and efficient handling of funding information. The application is designed as a local tool, eliminating the need for hosting.

## Features
- **Role-Based Authentication:** Admins have full CRUD access, while general users have view-only permissions.
- **Graphical Data Representation:** Interactive charts and graphs for data visualization.
- **One-Time Data Migration:** Funding data is imported from an Excel sheet.
- **Modern UI/UX:** Based on provided dashboard screenshots for an intuitive experience.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT-based authentication

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js & npm ([Download](https://nodejs.org/))
- MongoDB ([Download](https://www.mongodb.com/try/download/community))
- Git ([Download](https://git-scm.com/))

### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/dinethsadee01/Prop-Tech-Funding-Dashboard.git
   cd Prop-Tech-Funding-Dashboard
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. **Run the application:**
   ```sh
   npm run dev
   ```

## Usage
- **Admin Users:** Can add, update, and delete funding data with all general user actions.
- **General Users:** Can only view funding data, sort, search, filter, and export results as a .csv.
- **Data Import:** An initial one-time migration from the provided CSV file into the MongoDB Database.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing
Just to let you know, pull requests are welcome. For major changes, please open an issue first to discuss.

## Contact
For any inquiries, reach out via [Email](mailto:dnext2000@gmail.com) or [GitHubIssues](https://github.com/dinethsadee01/Prop-Tech-Funding-Dashboard/issues).

