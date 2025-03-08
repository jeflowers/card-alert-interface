const CardController = require('../../backend/controllers/cardController');
const CardModel = require('../../backend/models/cardModel');

describe('CardController', () => {
  test('blockCard prevents further transactions', async () => {
    const mockCardNumber = '4111222233334444';
    const mockBlockedCard = {
      cardNumber: mockCardNumber,
      status: 'BLOCKED',
      blockedAt: new Date()
    };

    jest.spyOn(CardModel, 'block').mockResolvedValue(mockBlockedCard);

    const mockReq = { body: { cardNumber: mockCardNumber } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await CardController.blockCard(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Card blocked successfully',
      card: mockBlockedCard
    });
  });

  test('reissueCard generates new card', async () => {
    const mockCardNumber = '4111222233334444';
    const mockCustomerId = 'CUST001';
    const mockNewCard = {
      cardNumber: '5555666677778888',
      customerId: mockCustomerId,
      status: 'ACTIVE'
    };

    jest.spyOn(CardModel, 'reissue').mockResolvedValue(mockNewCard);

    const mockReq = { body: { cardNumber: mockCardNumber, customerId: mockCustomerId } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await CardController.reissueCard(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Card reissued successfully',
      card: mockNewCard
    });
  });
});