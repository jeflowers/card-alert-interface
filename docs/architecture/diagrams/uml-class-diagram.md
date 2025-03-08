# Card Alert Interface UML Class Diagram

This diagram illustrates the core domain model and object relationships within the Card Alert Interface system. It shows the classes, their attributes, methods, and relationships between different entities.

## Purpose

The UML Class Diagram helps developers understand:
- The core entities in the system and their properties
- Relationships between different objects
- Service classes that implement business logic
- Methods available on each class

## Diagram

```mermaid
classDiagram
    class Alert {
        +int alertId
        +string transactionId
        +string cardNumber
        +string merchantName
        +float amount
        +string alertType
        +float riskScore
        +DateTime alertTimestamp
        +string status
        +getAlertDetails()
        +updateStatus(status)
        +createCase()
    }
    
    class Transaction {
        +int transactionId
        +string cardNumber
        +string merchantCode
        +float amount
        +DateTime timestamp
        +bool isSuspicious
        +string suspectReason
        +getTransactionDetails()
        +flagAsSuspicious(reason)
    }
    
    class Case {
        +int caseId
        +int alertId
        +string customerId
        +string createdBy
        +DateTime createdTimestamp
        +DateTime lastUpdatedTimestamp
        +float riskScore
        +string status
        +getCaseDetails()
        +updateStatus(status, comments)
        +addAction(actionType, details)
        +assignAnalyst(analystName)
        +resolve(resolution)
    }
    
    class CaseStatus {
        +int caseId
        +string status
        +DateTime statusTimestamp
        +string analystName
        +string comments
        +recordStatusChange(caseId, status)
    }
    
    class CaseAction {
        +int actionId
        +int caseId
        +string actionType
        +DateTime actionTimestamp
        +string actionBy
        +string actionDetails
        +recordAction(caseId, action)
    }
    
    class Card {
        +string cardNumber
        +string customerId
        +string status
        +DateTime issueDate
        +DateTime expiryDate
        +getCardDetails()
        +block(reason)
        +reissue()
        +getTransactionHistory()
    }
    
    class CardBlockReissue {
        +int blockReissueId
        +string cardNumber
        +string blockReason
        +DateTime blockTimestamp
        +string newCardNumber
        +string reissueStatus
        +blockCard(cardNumber, reason)
        +reissueCard(cardNumber)
        +updateReissueStatus(status)
    }
    
    class Hotlist {
        +int hotlistId
        +string cardNumber
        +string blockReason
        +DateTime blockTimestamp
        +DateTime expirationTimestamp
        +addToHotlist(cardNumber, reason)
        +removeFromHotlist(cardNumber)
        +checkIfHotlisted(cardNumber)
    }
    
    class User {
        +int userId
        +string username
        +string role
        +authenticate()
        +authorize(action)
        +getAssignedCases()
    }
    
    class AlertService {
        +getAlerts(filters)
        +getAlertById(alertId)
        +createAlert(alertData)
        +updateAlert(alertId, data)
    }
    
    class CaseService {
        +getCases(filters)
        +getCaseById(caseId)
        +createCase(caseData)
        +updateCase(caseId, data)
        +getCaseHistory(caseId)
        +assignCase(caseId, userId)
    }
    
    class CardService {
        +getBlockedCards(filters)
        +blockCard(cardData)
        +reissueCard(cardNumber)
        +getCardHistory(cardNumber)
    }
    
    Transaction --> Alert : generates
    Alert --> Case : creates
    Case --> CaseStatus : has
    Case --> CaseAction : has
    Card --> CardBlockReissue : undergoes
    CardBlockReissue --> Hotlist : adds to
    User --> Case : manages
    
    AlertService --> Alert : manages
    CaseService --> Case : manages
    CardService --> Card : manages
    CardService --> CardBlockReissue : manages
    CardService --> Hotlist : manages
```

## Key Classes

### Core Domain Entities
- **Alert**: Represents a suspicious transaction alert detected by the system
- **Case**: Encapsulates a fraud investigation case created from one or more alerts
- **Card**: Represents a payment card that can be blocked or reissued if compromised
- **User**: Represents a system user, typically a fraud analyst

### Service Classes
These classes encapsulate the business logic for managing the core entities:
- **AlertService**: Handles alert-related operations
- **CaseService**: Manages case workflows and status transitions
- **CardService**: Provides card management functionality

## Implementation Notes

The class diagram serves as a guide for the implementation of the object model in the codebase. While the actual implementation may involve additional helper classes and infrastructure components, this diagram captures the essential domain objects and their relationships.