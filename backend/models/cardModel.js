const database = require('../config/dbConfig');

class CardModel {
  static async block(cardNumber, reason) {
    const connection = await database.getConnection();
    try {
      const query = `
        UPDATE cards 
        SET status = 'BLOCKED', 
            block_reason = :1, 
            blocked_at = :2 
        WHERE card_number = :3
      `;
      
      const params = [
        reason || 'Suspicious Activity',
        new Date(),
        cardNumber
      ];

      await connection.execute(query, params);
      await connection.commit();
      return { cardNumber, status: 'BLOCKED', blockedAt: new Date() };
    } catch (error) {
      console.error('Error blocking card:', error);
      throw error;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  static async reissue(cardNumber, customerId) {
    const connection = await database.getConnection();
    try {
      // Generate new card number
      const newCardNumber = this.generateCardNumber();

      const query = `
        INSERT INTO cards 
        (card_number, customer_id, status, issued_at, previous_card_number) 
        VALUES (:1, :2, :3, :4, :5)
      `;
      
      const params = [
        newCardNumber,
        customerId,
        'ACTIVE',
        new Date(),
        cardNumber
      ];

      await connection.execute(query, params);
      await connection.commit();
      return { cardNumber: newCardNumber, customerId, status: 'ACTIVE' };
    } catch (error) {
      console.error('Error reissuing card:', error);
      throw error;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  static generateCardNumber() {
    // Simple card number generation
    // In a real-world scenario, this would be more complex
    return '4' + Math.random().toString().slice(2, 16);
  }
}

module.exports = CardModel;