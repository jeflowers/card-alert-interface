-- NYCE Card Alert Interface - PostgreSQL Schema

-- Fraud Alert Tables
CREATE TABLE fraud_alert (
    alert_id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(50) NOT NULL,
    card_number VARCHAR(16) NOT NULL,
    merchant_name VARCHAR(100),
    amount NUMERIC(12,2),
    alert_type VARCHAR(30),
    risk_score NUMERIC(5,2),
    alert_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'NEW'
);

CREATE TABLE fraud_card_block_reissue (
    block_reissue_id SERIAL PRIMARY KEY,
    card_number VARCHAR(16) NOT NULL,
    block_reason VARCHAR(255),
    block_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    new_card_number VARCHAR(16),
    reissue_status VARCHAR(20) DEFAULT 'PENDING'
);

CREATE TABLE fraud_card_suspect_tran (
    suspect_tran_id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(50) NOT NULL,
    card_number VARCHAR(16) NOT NULL,
    merchant_code VARCHAR(10),
    transaction_amount NUMERIC(12,2),
    transaction_timestamp TIMESTAMP,
    suspect_reason VARCHAR(255)
);

-- Case Management Tables
CREATE TABLE cs_case (
    case_id SERIAL PRIMARY KEY,
    alert_id INTEGER,
    customer_id VARCHAR(50),
    created_by VARCHAR(50) DEFAULT 'SYSTEM',
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_timestamp TIMESTAMP,
    case_risk_score NUMERIC(5,2),
    FOREIGN KEY (alert_id) REFERENCES fraud_alert(alert_id)
);

CREATE TABLE cs_case_status (
    case_id INTEGER,
    status VARCHAR(30) DEFAULT 'OPEN',
    status_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analyst_name VARCHAR(100),
    comments VARCHAR(500),
    PRIMARY KEY (case_id, status_timestamp),
    FOREIGN KEY (case_id) REFERENCES cs_case(case_id)
);

CREATE TABLE cs_case_action (
    action_id SERIAL PRIMARY KEY,
    case_id INTEGER,
    action_type VARCHAR(50),
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action_by VARCHAR(50),
    action_details VARCHAR(500),
    FOREIGN KEY (case_id) REFERENCES cs_case(case_id)
);

-- Hotlist Tables
CREATE TABLE fraud_hotlist (
    hotlist_id SERIAL PRIMARY KEY,
    card_number VARCHAR(16) NOT NULL UNIQUE,
    block_reason VARCHAR(255),
    block_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiration_timestamp TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_fraud_alert_card ON fraud_alert(card_number);
CREATE INDEX idx_fraud_alert_timestamp ON fraud_alert(alert_timestamp);
CREATE INDEX idx_cs_case_status ON cs_case_status(status);
CREATE INDEX idx_fraud_hotlist_card ON fraud_hotlist(card_number);