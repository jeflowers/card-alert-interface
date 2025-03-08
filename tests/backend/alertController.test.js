const AlertController = require('../../backend/controllers/alertController');
const AlertModel = require('../../backend/models/alertModel');

describe('AlertController', () => {
  test('processTransaction detects suspicious transaction', async () => {
    const mockTransaction = {
      cardNumber: '4111222233334444',
      amount: 6000,
      merchantName: 'High-Value Store'
    };

    const mockReq = { body: mockTransaction };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await AlertController.processTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Suspicious transaction detected'
    }));
  });

  test('getAlerts returns list of alerts', async () => {
    const mockAlerts = [{
      transactionId: 'TXN20250301001',
      cardNumber: '4111222233334444',
      amount: 750.50
    }];

    jest.spyOn(AlertModel, 'getAllAlerts').mockResolvedValue(mockAlerts);

    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await AlertController.getAlerts(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockAlerts);
  });
});