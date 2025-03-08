const database = require('../config/dbConfig');

class AlertModel {
  static async detectSuspiciousTransaction(transaction) {
    // Implement suspicious transaction detection logic
    const { amount, merchantCategory, customerSpendingPattern } = transaction;
    
    // Example detection criteria
    const THRESHOLD_AMOUNT = process.env.TRANSACTION_THRESHOLD_AMOUNT || 5000;
    const SUSPICIOUS_RATIO = process.env.SUSPICIOUS_TRANSACTION_RATIO || 0.8;

    if (amount > THRESHOLD_AMOUNT) {
      return true;
    }

    // More complex detection logic could be added here
    return false;
  }

  static async createAlert(transaction) {
    const connection = await database.getConnection();
    try {
      const query = `
        INSERT INTO alerts 
        (transaction_id, card_number, merchant_name, amount, timestamp, status) 
        VALUES (:1, :2, :3, :4, :5, :6)
      `;
      
      const params = [
        transaction.transactionId,
        transaction.cardNumber,
        transaction.merchantName,
        transaction.amount,
        new Date(),
        'SUSPICIOUS'
      ];

      await connection.execute(query, params);
      await connection.commit();
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  static async getAllAlerts() {
    const connection = await database.getConnection();
    try {
      const result = await connection.execute(
        'SELECT * FROM alerts WHERE status = :status', 
        { status: 'SUSPICIOUS' }
      );
      return result.rows;
    } catch (error) {
      console.error('Error retrieving alerts:', error);
      throw error;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
}

module.exports = AlertModel;