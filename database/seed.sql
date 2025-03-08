-- Seed Data for Card Alert Interface

-- Insert Sample Fraud Alerts
INSERT INTO FRAUD_ALERT (
    TRANSACTION_ID, CARD_NUMBER, MERCHANT_NAME, AMOUNT, 
    ALERT_TYPE, RISK_SCORE, STATUS
) VALUES
('TXN20250301001', '4111222233334444', 'Online Electronics Store', 1500.75, 
 'HIGH_AMOUNT', 85.5, 'NEW'),
('TXN20250301002', '5500112233445566', 'International Travel Booking', 3200.50, 
 'INTERNATIONAL', 92.3, 'NEW');

-- Insert Sample Suspect Transactions
INSERT INTO FRAUD_CARD_SUSPECT_TRAN (
    TRANSACTION_ID, CARD_NUMBER, MERCHANT_CODE, 
    TRANSACTION_AMOUNT, TRANSACTION_TIMESTAMP, SUSPECT_REASON
) VALUES
('TXN20250301001', '4111222233334444', 'ELEC001', 1500.75, 
 SYSTIMESTAMP, 'Unusual spending pattern'),
('TXN20250301002', '5500112233445566', 'TRVL002', 3200.50, 
 SYSTIMESTAMP, 'High-risk geographical location');

-- Insert Sample Cases
INSERT INTO CS_CASE (
    ALERT_ID, CUSTOMER_ID, CASE_RISK_SCORE
) VALUES
(1, 'CUST001', 85.5),
(2, 'CUST002', 92.3);

-- Insert Case Statuses
INSERT INTO CS_CASE_STATUS (
    CASE_ID, STATUS, ANALYST_NAME, COMMENTS
) VALUES
(1, 'OPEN', 'JOHN_DOE', 'Initial review of high-value transaction'),
(2, 'IN_PROGRESS', 'JANE_SMITH', 'Investigating international transaction');

-- Insert Hotlist Entries
INSERT INTO FRAUD_HOTLIST (
    CARD_NUMBER, BLOCK_REASON, EXPIRATION_TIMESTAMP
) VALUES
('4111222233334444', 'Suspected Fraudulent Activity', 
 SYSTIMESTAMP + INTERVAL '30' DAY);