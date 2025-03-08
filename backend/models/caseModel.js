/**
 * Case Model - Defines the case data structure
 * 
 * This model represents fraud cases generated from suspect transactions
 */

const db = require('../config/dbConfig');

class Case {
  constructor(data) {
    this.id = data.id;
    this.alertId = data.alert_id;
    this.status = data.status;
    this.priority = data.priority;
    this.fraudType = data.fraud_type;
    this.reasonCode = data.reason_code;
    this.notes = data.notes;
    this.assignedTo = data.assigned_to;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.accountNumber = data.acct_nbr; // From joined suspect_transactions table
  }

  // Static method to find all cases
  static async findAll() {
    try {
      const results = await db.query(
        'SELECT c.*, a.ACCT_NBR FROM CASES c JOIN SUSPECT_TRANSACTIONS a ON c.ALERT_ID = a.ID ORDER BY c.CREATED_AT DESC'
      );
      return results.map(row => new Case(row));
    } catch (error) {
      console.error('Error in Case.findAll:', error);
      throw error;
    }
  }

  // Static method to find a case by ID
  static async findById(id) {
    try {
      const result = await db.query(
        'SELECT c.*, a.ACCT_NBR FROM CASES c JOIN SUSPECT_TRANSACTIONS a ON c.ALERT_ID = a.ID WHERE c.ID = :id',
        [id]
      );
      if (result.length === 0) return null;
      return new Case(result[0]);
    } catch (error) {
      console.error(`Error in Case.findById(${id}):`, error);
      throw error;
    }
  }

  // Static method to find cases by status
  static async findByStatus(status) {
    try {
      const results = await db.query(
        'SELECT c.*, a.ACCT_NBR FROM CASES c JOIN SUSPECT_TRANSACTIONS a ON c.ALERT_ID = a.ID WHERE c.STATUS = :status ORDER BY c.CREATED_AT DESC',
        [status]
      );
      return results.map(row => new Case(row));
    } catch (error) {
      console.error(`Error in Case.findByStatus(${status}):`, error);
      throw error;
    }
  }

  // Method to save case to database
  async save() {
    try {
      // If ID exists, update existing record
      if (this.id) {
        await db.query(
          `UPDATE CASES SET 
            STATUS = :status, 
            PRIORITY = :priority, 
            FRAUD_TYPE = :fraudType, 
            REASON_CODE = :reasonCode, 
            NOTES = :notes, 
            ASSIGNED_TO = :assignedTo, 
            UPDATED_AT = CURRENT_TIMESTAMP 
          WHERE ID = :id`,
          [this.status, this.priority, this.fraudType, this.reasonCode, this.notes, this.assignedTo, this.id]
        );
        return this;
      }
      
      // Otherwise create new record
      const result = await db.query(
        `INSERT INTO CASES (
          ALERT_ID, STATUS, PRIORITY, FRAUD_TYPE, REASON_CODE, NOTES, ASSIGNED_TO
        ) VALUES (
          :alertId, :status, :priority, :fraudType, :reasonCode, :notes, :assignedTo
        ) RETURNING ID INTO :id`,
        [this.alertId, this.status, this.priority, this.fraudType, this.reasonCode, this.notes, this.assignedTo]
      );
      
      this.id = result.id;
      return this;
    } catch (error) {
      console.error('Error in Case.save:', error);
      throw error;
    }
  }

  // Method to get confirmed fraud cases for export
  static async getConfirmedFraudForExport() {
    try {
      const results = await db.query(
        `SELECT c.*, a.ACCT_NBR 
        FROM CASES c 
        JOIN SUSPECT_TRANSACTIONS a ON c.ALERT_ID = a.ID 
        WHERE c.STATUS = 'CONFIRMED_FRAUD' 
        AND c.ID IN (SELECT CASE_ID FROM FRAUD_FILE_EXPORT WHERE EXPORT_STATUS = 'PENDING')`
      );
      return results.map(row => ({
        caseId: row.id,
        accountNumber: row.acct_nbr,
        fraudType: row.fraud_type,
        reasonCode: row.reason_code
      }));
    } catch (error) {
      console.error('Error in Case.getConfirmedFraudForExport:', error);
      throw error;
    }
  }
}

module.exports = Case;