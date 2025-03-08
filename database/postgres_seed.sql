-- Seed Data for Card Alert Interface

-- Insert Sample Fraud Alerts
INSERT INTO fraud_alert (
    transaction_id, card_number, merchant_name, amount, 
    alert_type, risk_score, status
) VALUES
('TXN20250301001', '4111222233334444', 'Online Electronics Store', 1500.75, 
 'HIGH_AMOUNT', 85.5, 'NEW'),
('TXN20250301002', '5500112233445566', 'International Travel Booking', 3200.50, 
 'INTERNATIONAL', 92.3, 'NEW');

-- Insert Sample Suspect Transactions
INSERT INTO fraud_card_suspect_tran (
    transaction_id, card_number, merchant_code, 
    transaction_amount, transaction_timestamp, suspect_reason
) VALUES
('TXN20250301001', '4111222233334444', 'ELEC001', 1500.75, 
 CURRENT_TIMESTAMP, 'Unusual spending pattern'),
('TXN20250301002', '5500112233445566', 'TRVL002', 3200.50, 
 CURRENT_TIMESTAMP, 'High-risk geographical location');

-- Insert Sample Cases
INSERT INTO cs_case (
    alert_id, customer_id, case_risk_score
) VALUES
(1, 'CUST001', 85.5),
(2, 'CUST002', 92.3);

-- Insert Case Statuses
INSERT INTO cs_case_status (
    case_id, status, analyst_name, comments
) VALUES
(1, 'OPEN', 'JOHN_DOE', 'Initial review of high-value transaction'),
(2, 'IN_PROGRESS', 'JANE_SMITH', 'Investigating international transaction');

-- Insert Hotlist Entries
INSERT INTO fraud_hotlist (
    card_number, block_reason, expiration_timestamp
) VALUES
('4111222233334444', 'Suspected Fraudulent Activity', 
 CURRENT_TIMESTAMP + INTERVAL '30 days');