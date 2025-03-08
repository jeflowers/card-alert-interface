# Card Alert Interface Activity Diagram

This activity diagram shows the business processes and workflows within the Card Alert Interface system. It illustrates how activities relate to each other and the different paths that can be taken during the fraud investigation process.

## Purpose

The Activity Diagram helps to understand:
- The sequence of activities in the fraud management workflow
- Decision points and alternative paths
- Responsibility areas (shown as swimlanes)
- Start and end states of the process

## Diagram

```mermaid
stateDiagram-v2
    [*] --> ReceiveAlert: Transaction Alert Received
    
    state "Alert Processing" as AlertProcess {
        ReceiveAlert --> ValidateAlert: Parse and validate alert data
        ValidateAlert --> RiskScoring: Calculate risk score
        
        RiskScoring --> EvaluateRisk
        
        state EvaluateRisk <<choice>>
        EvaluateRisk --> AutomaticCase: Risk score > High threshold
        EvaluateRisk --> QueueForReview: Risk score > Low threshold
        EvaluateRisk --> MarkSafe: Risk score < Low threshold
    }
    
    AutomaticCase --> CreateCase: High priority case
    QueueForReview --> AnalystReview: Add to analyst queue
    
    state "Analyst Review" as AnalystReviewProcess {
        AnalystReview --> ReviewTransaction: Review transaction details
        ReviewTransaction --> ReviewCustomerHistory: Check customer's history
        ReviewCustomerHistory --> DecisionPoint
        
        state DecisionPoint <<choice>>
        DecisionPoint --> CreateCase: Suspicious activity confirmed
        DecisionPoint --> MarkSafe: No suspicious activity
    }
    
    state "Case Management" as CaseManagement {
        CreateCase --> AssignAnalyst: Assign to available analyst
        AssignAnalyst --> Investigation: Begin investigation
        
        state Investigation {
            state "Investigation Actions" as InvestigationActions {
                ContactCustomer: Contact customer for verification
                ReviewAdditionalData: Review additional transactions
                DocumentFindings: Document investigation findings
            }
        }
        
        Investigation --> FraudDetermination
        
        state FraudDetermination <<choice>>
        FraudDetermination --> InitiateCardActions: Fraud confirmed
        FraudDetermination --> CloseCase: False positive
    }
    
    state "Card Actions" as CardActions {
        InitiateCardActions --> BlockCard: Block compromised card
        BlockCard --> AddToHotlist: Add to fraud hotlist
        
        AddToHotlist --> ReissueDecision
        
        state ReissueDecision <<choice>>
        ReissueDecision --> RequestNewCard: Reissue requested
        ReissueDecision --> FinalizeCase: No reissue needed
        
        RequestNewCard --> TrackReissue: Monitor reissue status
        TrackReissue --> FinalizeCase: Card reissued
    }
    
    CloseCase --> CaseResolution: Resolve as false positive
    FinalizeCase --> CaseResolution: Resolve as confirmed fraud
    
    state "Case Resolution" as CaseRes {
        CaseResolution --> UpdateCaseStatus: Update final status
        UpdateCaseStatus --> RecordAction: Log resolution action
        RecordAction --> NotifyRelevantParties: Send notifications
    }
    
    MarkSafe --> [*]: Alert closed
    NotifyRelevantParties --> [*]: Case closed
    
    %% Swimlanes
    state "System" as Sys {
        AlertProcess
        AutomaticCase
    }
    
    state "Fraud Analyst" as Analyst {
        AnalystReviewProcess
        CaseManagement
    }
    
    state "Card Operations" as CardOps {
        CardActions
    }
    
    state "Case Admin" as Admin {
        CaseRes
    }
```

## Activity Flow

The activity diagram shows the flow through several major phases:

1. **Alert Reception and Evaluation**: System automatically receives and scores incoming alerts

2. **Analyst Review**: For alerts that require human judgment, an analyst reviews transaction details

3. **Case Investigation**: When suspicious activity is confirmed, a formal investigation begins

4. **Fraud Determination**: Decision point where fraud is either confirmed or ruled out

5. **Card Actions**: If fraud is confirmed, the card is blocked and potentially reissued

6. **Case Resolution**: Final documentation and notification of the resolution

## Responsibility Areas (Swimlanes)

The diagram uses swimlanes to show which role or system component is responsible for each activity:

- **System**: Automated activities performed by the application
- **Fraud Analyst**: Activities requiring human investigation and judgment
- **Card Operations**: Activities related to card management
- **Case Admin**: Activities related to case resolution and documentation

## Implementation Notes

When implementing the activities in this diagram:

- Ensure smooth transitions between different responsible parties
- Implement proper notification mechanisms for handoffs
- Provide adequate UI support for each activity
- Implement proper state management to track where each case is in the workflow