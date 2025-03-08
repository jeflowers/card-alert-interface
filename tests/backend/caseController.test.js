const CaseController = require('../../backend/controllers/caseController');
const CaseModel = require('../../backend/models/caseModel');

describe('CaseController', () => {
  test('createCase generates new case', async () => {
    const mockCaseData = {
      alertId: 'TXN20250301001',
      customerId: 'CUST001',
      description: 'Unusual transaction pattern'
    };

    const mockCreatedCase = {
      id: 1,
      ...mockCaseData,
      status: 'OPEN'
    };

    jest.spyOn(CaseModel, 'create').mockResolvedValue(mockCreatedCase);

    const mockReq = { body: mockCaseData };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await CaseController.createCase(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockCreatedCase);
  });

  test('updateCase modifies existing case', async () => {
    const mockUpdateData = {
      status: 'IN_PROGRESS',
      investigator: 'JANE_SMITH'
    };

    const mockUpdatedCase = {
      id: 1,
      ...mockUpdateData
    };

    jest.spyOn(CaseModel, 'update').mockResolvedValue(mockUpdatedCase);

    const mockReq = { 
      params: { caseId: '1' },
      body: mockUpdateData 
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await CaseController.updateCase(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedCase);
  });
});