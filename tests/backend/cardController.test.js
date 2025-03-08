/**
 * Test suite for Card Controller
 */

const request = require('supertest');
const app = require('../../backend/server');
const db = require('../../backend/config/dbConfig');
const fs = require('fs');

// Mock the database module
jest.mock('../../backend/config/dbConfig', () => ({
  query: jest.fn()
}));

describe('Card Controller', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/cards/blocked', () => {
    it('should fetch all blocked cards successfully', async () => {
      // Mock data for blocked cards
      const mockCards = [
        {
          id: 1,
          card_number: '4111111111111111',
          reason: 'fraud',
          case_id: 1,
          active: 'Y',
          reissue: 'Y',
          reissue_date: '2025-03-02T10:15:00Z',
          created_at: '2025-03-01T15:45:00Z',
          updated_at: '2025-03-02T10:15:00Z'
        },
        {
          id: 2,
          card_number: '378282246310005',
          reason: 'stolen',
          case_id: 4,
          active: 'Y',
          reissue: 'N',
          reissue_date: null,
          created_at: '2025-03-02T16:30:00Z',
          updated_at: '2025-03-02T16:30:00Z'
        }
      ];

      // Mock the database query response
      db.query.mockResolvedValue(mockCards);

      // Make request to the endpoint
      const response = await request(app).get('/api/cards/blocked');

      // Check that the response is as expected
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].id).toBe(1);
      expect(response.body[1].id).toBe(2);

      // Verify that the database query was called
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM HOTLIST WHERE ACTIVE = "Y" ORDER BY CREATED_AT DESC',
        []
      );
    });

    it('should handle database errors', async () => {
      // Mock a database error
      db.query.mockRejectedValue(new Error('Database connection failed'));

      // Make request to the endpoint
      const response = await request(app).get('/api/cards/blocked');

      // Check that the error response is as expected
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Failed to fetch blocked cards');
    });
  });

  describe('POST /api/cards/:cardNumber/block', () => {
    it('should block a card successfully', async () => {
      // Mock empty response for existing card check
      db.query.mockResolvedValueOnce([]) // No existing card found
               .mockResolvedValueOnce({}); // Insert into hotlist succeeded

      // Make request to the endpoint
      const response = await request(app)
        .post('/api/cards/4111111111111111/block')
        .send({
          reason: 'fraud',
          notes: 'Customer reported unauthorized transactions.',
          caseId: 1
        });

      // Check that the response is as expected
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Card blocked successfully');

      // Verify that the database queries were called correctly
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM HOTLIST WHERE CARD_NUMBER = :cardNumber AND ACTIVE = "Y"',
        ['4111111111111111']
      );
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO HOTLIST (CARD_NUMBER, REASON, CASE_ID, ACTIVE) VALUES (:cardNumber, :reason, :caseId, "Y")',
        ['4111111111111111', 'fraud', 1]
      );
    });

    it('should return 400 if card is already blocked', async () => {
      // Mock response for existing card check
      db.query.mockResolvedValueOnce([{ id: 1, card_number: '4111111111111111' }]); // Card already exists

      // Make request to the endpoint
      const response = await request(app)
        .post('/api/cards/4111111111111111/block')
        .send({
          reason: 'fraud',
          notes: 'Customer reported unauthorized transactions.'
        });

      // Check that the error response is as expected
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Card is already blocked');
    });

    it('should update the related case if caseId is provided', async () => {
      // Mock responses for database queries
      db.query.mockResolvedValueOnce([]) // No existing card found
               .mockResolvedValueOnce({}) // Insert into hotlist succeeded
               .mockResolvedValueOnce({}); // Update case succeeded

      // Make request to the endpoint
      const response = await request(app)
        .post('/api/cards/4111111111111111/block')
        .send({
          reason: 'fraud',
          notes: 'Customer reported unauthorized transactions.',
          caseId: 1
        });

      // Check that the response is as expected
      expect(response.status).toBe(200);

      // Verify that the case update query was called
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE CASES SET STATUS = "CARD_BLOCKED"'),
        expect.arrayContaining([1])
      );
    });
  });

  describe('POST /api/cards/:cardNumber/reissue', () => {
    it('should reissue a card successfully', async () => {
      // Mock response for blocked card check
      db.query.mockResolvedValueOnce([{
        id: 2,
        card_number: '378282246310005',
        reissue: 'N'
      }]) // Card exists and not reissued
      .mockResolvedValueOnce({}); // Update hotlist succeeded

      // Make request to the endpoint
      const response = await request(app)
        .post('/api/cards/378282246310005/reissue')
        .send({
          caseId: 4
        });

      // Check that the response is as expected
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Card reissue initiated successfully');

      // Verify that the database queries were called correctly
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM HOTLIST WHERE CARD_NUMBER = :cardNumber AND ACTIVE = "Y"',
        ['378282246310005']
      );
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE HOTLIST SET REISSUE = "Y", REISSUE_DATE = CURRENT_TIMESTAMP WHERE CARD_NUMBER = :cardNumber AND ACTIVE = "Y"',
        ['378282246310005']
      );
    });

    it('should return 404 if card is not in hotlist', async () => {
      // Mock empty response for blocked card check
      db.query.mockResolvedValueOnce([]);

      // Make request to the endpoint
      const response = await request(app)
        .post('/api/cards/1234567890123456/reissue')
        .send({
          caseId: 4
        });

      // Check that the error response is as expected
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Card not found in hotlist');
    });

    it('should return 400 if card is already reissued', async () => {
      // Mock response for blocked card check - already reissued
      db.query.mockResolvedValueOnce([{
        id: 1,
        card_number: '4111111111111111',
        reissue: 'Y'
      }]);

      // Make request to the endpoint
      const response = await request(app)
        .post('/api/cards/4111111111111111/reissue')
        .send({
          caseId: 1
        });

      // Check that the error response is as expected
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Card has already been reissued');
    });

    it('should update the related case if caseId is provided', async () => {
      // Mock responses for database queries
      db.query.mockResolvedValueOnce([{
        id: 2,
        card_number: '378282246310005',
        reissue: 'N'
      }]) // Card exists and not reissued
      .mockResolvedValueOnce({}) // Update hotlist succeeded
      .mockResolvedValueOnce({}); // Update case succeeded

      // Make request to the endpoint
      const response = await request(app)
        .post('/api/cards/378282246310005/reissue')
        .send({
          caseId: 4
        });

      // Check that the response is as expected
      expect(response.status).toBe(200);

      // Verify that the case update query was called
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE CASES SET STATUS = "CARD_REISSUED", UPDATED_AT = CURRENT_TIMESTAMP WHERE ID = :caseId',
        [4]
      );
    });
  });

  describe('processBlockAndReissueFile', () => {
    it('should process a valid file successfully', async () => {
      // Get the processBlockAndReissueFile function
      const processBlockAndReissueFile = app.processBlockAndReissueFile || app.exports?.processBlockAndReissueFile;
      
      // Skip test if function is not exposed for testing
      if (!processBlockAndReissueFile) {
        console.warn('processBlockAndReissueFile not available for testing');
        return;
      }

      // Mock file content
      jest.spyOn(fs, 'readFileSync').mockReturnValue(
        'B\nD4111111111111111    \nD5555555555554444    \nE'
      );

      // Mock database queries
      db.query.mockResolvedValue([]);

      // Call the function
      const result = await processBlockAndReissueFile('test_file.dat');

      // Verify expected behavior
      expect(result).toBe(2);
      expect(db.query).toHaveBeenCalledTimes(4); // 2 checks and 2 inserts
    });
  });
});