# NYCE Card Alert Interface

## Overview

The Card Alert Interface is a web-based application designed to integrate CardAlert's workflow with the Fraud Analytics system. This integration speeds up response times to fraud alerts by issuers and creates additional efficiencies by enabling analysts to manage alerts in a common workflow.

## Key Features

- **Suspect Transaction Processing**: Import and process suspect transactions from CardAlert
- **Case Management**: Create, update, and track fraud cases
- **Card Block & Reissue**: Quickly block compromised cards and initiate reissue
- **Fraud Export**: Generate confirmed fraud files for Card Alert system

## Architecture

The application follows a modular architecture with these components:

- **Frontend**: HTML, JavaScript, and Tailwind CSS interface
- **Backend API**: Node.js/Express server with REST endpoints
- **Database**: Oracle database to store transactions, cases, and hotlists
- **File Processing**: Handling batch files for suspect transactions, block & reissue requests, and fraud exports

## Project Structure

```
card-alert-interface/
│── backend/                   # Backend API (Node.js, Express, Oracle DB)
│   ├── controllers/           # Business logic for alerts, transactions, etc.
│   ├── models/                # Database models/schema definitions
│   ├── routes/                # API routes
│   ├── config/                # Configuration (database, env variables)
│   ├── server.js              # Main backend entry point
│
│── frontend/                  # Frontend (HTML, JavaScript, Tailwind CSS)
│   ├── assets/                # Images, icons, styles
│   ├── styles/                # CSS stylesheets
│   ├── js/                    # JavaScript logic
│   ├── index.html             # Main UI
│
│── database/                   # Database scripts
│   ├── schema.sql              # Table structure
│   ├── seed.sql                # Initial test data
│
│── docs/                       # Documentation
│   ├── README.md               # Project description
│   ├── API_Documentation.md    # API endpoints & usage
│
│── tests/                      # Unit & integration tests
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- Oracle Database (v12c or later)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jeflowers/card-alert-interface.git
   cd card-alert-interface
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with your Oracle database credentials
   ```

4. Set up the database:
   ```bash
   # Run the schema.sql and seed.sql scripts in your Oracle database
   ```

5. Start the server:
   ```bash
   npm start
   ```

6. Open the application:
   ```
   Open frontend/index.html in a web browser
   ```

## File Specifications

### Suspect Transactions File

Format follows the Fraud Analytics Batch file format as described in the Developer's Guide. File includes a header record, transaction detail records, and a footer record.

Example naming convention:
```
fd_10001272_sus_MMDDYYYYHHMMSS -- data file
fd_10001272_sus_MMDDYYYYHHMMSS.c110 -- semaphore file
```

### Block and Reissue File

Contains account numbers of all Block and Reissue transactions to be loaded into hotlist tables.

Example naming convention:
```
fd_10001272_bandr_MMDDYYYYHHMMSS -- data
fd_10001272_bandr_MMDDYYYYHHMMSS.trg -- semaphore
```

### Fraud Cases File

Contains account numbers confirmed as fraud on Fraud Analytics.

Example naming convention:
```
ff_10001272_MMDDYYYYHHMMSS.txt -- data
ff_10001272_MMDDYYYYHHMMSS.trg -- semaphore
```

## API Documentation

See [API_Documentation.md](./API_Documentation.md) for detailed information about available endpoints.

## Testing

Run the test suite using:

```bash
npm test
```

## License

This project is licensed under the MIT License.
