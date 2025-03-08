# NYCE Card Alert Interface API Documentation

## Overview

The Card Alert Interface API provides endpoints for managing suspect transactions, fraud cases, and card blocking/reissuing. This document outlines the available endpoints, request formats, and response structures.

## Base URL

All API endpoints are relative to the base URL:

```
http://your-server-address:3000/api
```

## Authentication

Currently, the API uses a simple authentication method. Include your API key in the request headers:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Alerts (Suspect Transactions)

#### Get All Alerts

```
GET /alerts
```

Returns a list of suspect transactions from the Card Alert system.

**Query Parameters:**
- `status` (optional): Filter by status ('new' or 'cased')
- `limit` (optional): Limit number of results (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
[
  {
    "id": 1,
    "accountNumber": "4111111111111111",
    "transactionDate": "2025-03-01",
    "transactionTime": "09:23:45",
    "transactionAmount": 599.99,
    "transactionType": "M",
    "merchantName": "BEST ELECTRONICS",
    "merchantCity": "NEW YORK",
    "merchantState": "NY",
    "merchantCountry": "840",
    "posEntryMode": "S",
    "cased": "Y",
    "createdAt": "2025-03-01T10:00:00Z"
  },
  // More alerts...
]
```

#### Get Single Alert

```
GET /alerts/:id
```

Returns detailed information about a specific alert.

**Response:**
```json
{
  "id": 1,
  "accountNumber": "4111111111111111",
  "transactionDate": "2025-03-01",
  "transactionTime": "09:23:45",
  "transactionAmount": 599.99,
  "transactionType": "M",
  "merchantCategory": "5411",
  "merchantName": "BEST ELECTRONICS",
  "merchantCity": "NEW YORK",
  "merchantState": "NY",
  "merchantCountry": "840",
  "merchantPostCode": "10001",
  "posEntryMode": "S",
  "authDecisionCd": "A",
  "caseCreInd": "Y",
  "cased": "Y",
  "createdAt": "2025-03-01T10:00:00Z",
  "updatedAt": "2025-03-01T10:00:00Z"
}
```

#### Create Case from Alert

```
POST /alerts/:alertId/case
```

Creates a new fraud case from an alert.

**Request Body:**
```json
{
  "priority": "high",
  "notes": "Suspicious transaction pattern detected."
}
```

**Response:**
```json
{
  "message": "Case created successfully",
  "caseId": 5
}
```

### Cases

#### Get All Cases

```
GET /cases
```

Returns a list of fraud cases.

**Query Parameters:**
- `status` (optional): Filter by status ('NEW', 'INVESTIGATING', 'CONFIRMED_FRAUD', 'RESOLVED', 'CARD_BLOCKED')
- `priority` (optional): Filter by priority ('high', 'medium', 'low')
- `limit` (optional): Limit number of results (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
[
  {
    "id": 1,
    "alertId": 1,
    "accountNumber": "4111111111111111",
    "status": "CONFIRMED_FRAUD",
    "priority": "high",
    "fraudType": 51,
    "reasonCode": 101,
    "notes": "Multiple electronics purchases in short timeframe. Customer confirmed card was stolen.",
    "assignedTo": "analyst1",
    "createdAt": "2025-03-01T12:30:00Z",
    "updatedAt": "2025-03-02T09:15:00Z"
  },
  // More cases...
]
```

#### Get Single Case

```
GET /cases/:id
```

Returns detailed information about a specific case.

**Response:**
```json
{
  "id": 1,
  "alertId": 1,
  "accountNumber": "4111111111111111",
  "status": "CONFIRMED_FRAUD",
  "priority": "high",
  "fraudType": 51,
  "reasonCode": 101,
  "notes": "Multiple electronics purchases in short timeframe. Customer confirmed card was stolen.",
  "assignedTo": "analyst1",
  "createdAt": "2025-03-01T12:30:00Z",
  "updatedAt": "2025-03-02T09:15:00Z",
  "alert": {
    "id": 1,
    "transactionDate": "2025-03-01",
    "transactionAmount": 599.99,
    "merchantName": "BEST ELECTRONICS"
    // Additional alert details...
  }
}
```

#### Update Case Status

```
PUT /cases/:id/status
```

Updates the status of a case.

**Request Body:**
```json
{
  "status": "CONFIRMED_FRAUD",
  "notes": "Customer confirmed these transactions are fraudulent."
}
```

**Response:**
```json
{
  "message": "Case status updated successfully"
}
```

#### Generate Fraud Cases File

```
POST /cases/generate-fraud-file
```

Generates a file containing confirmed fraud cases for export to Card Alert system.

**Response:**
```json
{
  "message": "Fraud cases file generated successfully",
  "count": 2
}
```

### Cards

#### Get Blocked Cards

```
GET /cards/blocked
```

Returns a list of blocked cards.

**Response:**
```json
[
  {
    "id": 1,
    "cardNumber": "4111111111111111",
    "reason": "fraud",
    "caseId": 1,
    "active": "Y",
    "reissue": "Y",
    "reissueDate": "2025-03-02T10:15:00Z",
    "createdAt": "2025-03-01T15:45:00Z",
    "updatedAt": "2025-03-02T10:15:00Z"
  },
  // More blocked cards...
]
```

#### Block Card

```
POST /cards/:cardNumber/block
```

Blocks a card due to suspected fraud.

**Request Body:**
```json
{
  "reason": "fraud",
  "notes": "Customer reported unauthorized transactions.",
  "caseId": 1
}
```

**Response:**
```json
{
  "message": "Card blocked successfully"
}
```

#### Reissue Card

```
POST /cards/:cardNumber/reissue
```

Reissues a previously blocked card.

**Request Body:**
```json
{
  "caseId": 1
}
```

**Response:**
```json
{
  "message": "Card reissue initiated successfully"
}
```

## Error Responses

All endpoints return standard error responses in the following format:

```json
{
  "message": "Error message describing what went wrong"
}
```

Common HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Rate Limiting

API requests are limited to 100 requests per minute per API key. Exceeding this limit will result in a `429 Too Many Requests` response.