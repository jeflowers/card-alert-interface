/**
 * Test suite for Alert Controller
 */

const request = require('supertest');
const app = require('../../backend/server');
const db = require('../../backend/config/dbConfig');

// Mock the database module
jest.mock('../../backend/config/dbConfig', () => ({
  query: jest.fn()
}));

describe('Alert Controller', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/alerts', () => {
    it('should fetch all alerts successfully', async () => {
      // Mock data for alerts
      const mockAlerts = [
        {
          id: 1,
          acct_nbr: '4111111111111111',
          trans_date: '2025-03-01',
          trans_time: '09:23:45',
          trans_amt: 599.99,
          merch_nm: 'BEST ELECTRONICS',
          cased: 'N'
        },
        {
          id: 2,
          acct_nbr: '5555555555554444',
          trans_date: '2025-03-02',
          trans_time: '14:32:17',
          trans_amt: 129.99,
          merch_nm: 'LUXURY RESTAURANT',
          cased: 'Y'
        }
      ];

      // Mock the database query response
      db.query.mockResolvedValue(mockAlerts);

      // Make request to the endpoint
      const response = await request(app).get('/api/alerts');

      // Check that the response is as expected
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].id).toBe(1);
      expect(response.body[1].id).toBe(2);

      // Verify that the database query was called
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM SUSPECT_TRANSACTIONS ORDER BY TRANS_DATE DESC');
    });

    it('should handle database errors', async () => {
      // Mock a database error
      db.query.mockRejectedValue(new Error('Database connection failed'));

      // Make request to the endpoint
      const response = await request(app).get('/api/alerts');

      // Check that the error response is as expected
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Failed to fetch alerts');
    });
  });

  describe('GET /api/alerts/:id', () => {
    it('should fetch a single alert by ID', async () => {
      // Mock data for a single alert
      const mockAlert = {
        id: 1,
        acct_nbr: '4111111111111111',
        trans_date: '2025-03-01',
        trans_time: '09:23:45',
        trans_amt: 599.99,
        merch_nm: 'BEST ELECTRONICS',
        cased: 'N'
      };

      // Mock the database query response
      db.query.mockResolvedValue([mockAlert]);

      // Make request to the endpoint
      const response = await request(app).get('/api/alerts/1');

      // Check that the response is as expected
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.acct_nbr).toBe('4111111111111111');

      // Verify that the database query was called with the correct ID
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM SUSPECT_TRANSACTIONS WHERE ID = :id', [1]);
    });

    it('should return 404 if alert not found', async () => {
      // Mock an empty response (alert not found)
      db.query.mockResolvedValue([]);

      // Make request to the endpoint
      const response = await request(app).get('/api/alerts/999');

      // Check that the error response is as expected
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Alert not found');
    });
  });

  describe('POST /api/alerts/:alertId/case', () => {
    it('should create a case from an alert', async () => {
      // Mock data for case creation
      const mockResult = { insertId: 5 };

      // Mock the database queries for case creation and alert update
      db.query.mockResolvedValueOnce(mockResult) // First call - insert case
               .mockResolvedValueOnce({}); // Second call - update alert

      // Make request to the endpoint
      const response = await request(app)
        .post('/api/alerts/1/case')
        .send({
          priority: 'high',
          notes: 'Suspicious transaction pattern.'
        });

      // Check that the response is as expected
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Case created successfully');
      expect(response.body).toHaveProperty('caseId', 5);

      // Verify that the database queries were called
      expect(db.query).toHaveBeenCalledTimes(2);
    });

    it('should handle database errors during case creation', async () => {
      // Mock a database error
      db.query.mockRejectedValue(new Error('Database error during case creation'));

      // Make request to the endpoint
      const response = await request(app)
        .post('/api/alerts/1/case')
        .send({
          priority: 'high',
          notes: 'Suspicious transaction pattern.'
        });

      // Check that the error response is as expected
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Failed to create case');
    });
  });
});