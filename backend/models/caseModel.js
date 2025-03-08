const database = require('../config/dbConfig');

class CaseModel {
  static async create(caseData) {
    const connection = await database.getConnection();
    try {
      const query = `
        INSERT INTO fraud_cases 
        (alert_id, customer_id, status, investigator, description, created_at) 
        VALUES (:1, :2, :3, :4, :5, :6) RETURNING id
      `;
      
      const params = [
        caseData.alertId,
        caseData.customerId,
        'OPEN',
        caseData.investigator || 'SYSTEM',
        caseData.description || 'Suspicious transaction investigation',
        new Date()
      ];

      const result = await connection.execute(query, params);
      await connection.commit();
      return result.rows[0];
    } catch (error) {
      console.error('Error creating case:', error);
      throw error;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  static async update(caseId, updateData) {
    const connection = await database.getConnection();
    try {
      const query = `
        UPDATE fraud_cases 
        SET status = :1, 
            investigator = :2, 
            description = :3, 
            updated_at = :4 
        WHERE id = :5
      `;
      
      const params = [
        updateData.status || 'IN_PROGRESS',
        updateData.investigator,
        updateData.description,
        new Date(),
        caseId
      ];

      await connection.execute(query, params);
      await connection.commit();
      return { id: caseId, ...updateData };
    } catch (error) {
      console.error('Error updating case:', error);
      throw error;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  static async getAll() {
    const connection = await database.getConnection();
    try {
      const result = await connection.execute(
        'SELECT * FROM fraud_cases ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      console.error('Error retrieving cases:', error);
      throw error;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
}

module.exports = CaseModel;