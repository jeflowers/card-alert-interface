# Card Alert Interface API Documentation

## Authentication
- All endpoints require JWT authentication
- Token must be included in Authorization header

## Alerts Endpoints
### Process Transaction
- **POST** `/api/alerts/process`
- Detects and logs suspicious transactions

### Get Alerts
- **GET** `/api/alerts`
- Retrieves list of suspicious transactions

## Cases Endpoints
### Create Case
- **POST** `/api/cases`
- Creates a new fraud investigation case

### Update Case
- **PUT** `/api/cases/:caseId`
- Updates an existing case status or details

### Get Cases
- **GET** `/api/cases`
- Retrieves list of fraud cases

## Card Management Endpoints
### Block Card
- **POST** `/api/cards/block`
- Blocks a card based on suspicious activity

### Reissue Card
- **POST** `/api/cards/reissue`
- Generates and issues a new card replacement