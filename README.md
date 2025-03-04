# Fraud Analytics Card Alert Interface (FACAI)

## Overview
The **Fraud Analytics Card Alert Interface (FACAI)** is a web-based front-end designed to **monitor, manage, and mitigate fraudulent transactions** efficiently. It integrates with backend fraud detection systems to provide **real-time alerts**, user-friendly controls, and automation for security analysts.

## Features
- **Real-time Fraud Alerts:** View, filter, and manage alerts for suspect transactions.
- **Case Management:** Update fraud case statuses and escalate cases as needed.
- **Card Blocking & Reissuance:** Quickly block compromised cards and initiate reissuance.
- **Secure API Integration:** Fetch transaction details from a secure backend database.
- **User-Friendly Interface:** Built using **JavaScript, Tailwind CSS**, and responsive design.
- **Live Data Fetching:** Uses **RESTful APIs** to interact with an Oracle-based fraud management system.

## Technologies Used
- **Frontend:** JavaScript (Vanilla JS), Tailwind CSS
- **Backend API:** Node.js (Express.js), Oracle DB
- **Security:** JWT Authentication (optional), Secure Data Handling
- **Version Control:** Git, GitHub

## Setup Instructions
### 1. Clone the Repository
```sh
 git clone https://github.com/YOUR_USERNAME/card-alert-interface.git
 cd card-alert-interface
```

### 2. Install Dependencies (For API Backend)
```sh
npm install express oracledb dotenv cors
```

### 3. Configure Database Connection
Update `.env` with your Oracle DB credentials:
```sh
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_CONNECT_STRING=your_db_host/service_name
```

### 4. Run the Backend API
```sh
node server.js
```

### 5. Open the Frontend
Simply open `index.html` in a browser or serve it using a local server.

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/alerts` | Fetch fraud alerts |
| GET | `/transactions/:alertId` | Get transaction details for an alert |
| POST | `/cases/:caseId/status` | Update fraud case status |
| POST | `/cards/:cardNumber/block` | Block a compromised card |

## Deployment
For live hosting, use **GitHub Pages**, AWS, or Firebase Hosting.

## Contributors
- **John Flowers** - Developer & Architect

## License
This project is licensed under the MIT License.

## Contact

