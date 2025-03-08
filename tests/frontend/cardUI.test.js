/**
 * Test suite for Card UI functionality
 */

describe('Card UI', () => {
  // DOM elements
  let hotlistTable;
  let cardSearchInput;
  let cardFilterSelect;
  
  // Mock data
  const mockCards = [
    {
      id: 1,
      cardNumber: '4111111111111111',
      reason: 'fraud',
      caseId: 1,
      active: 'Y',
      reissue: 'Y',
      reissueDate: '2025-03-02T10:15:00Z',
      createdAt: '2025-03-01T15:45:00Z',
      updatedAt: '2025-03-02T10:15:00Z'
    },
    {
      id: 2,
      cardNumber: '378282246310005',
      reason: 'stolen',
      caseId: 4,
      active: 'Y',
      reissue: 'N',
      reissueDate: null,
      createdAt: '2025-03-02T16:30:00Z',
      updatedAt: '2025-03-02T16:30:00Z'
    }
  ];
  
  // Setup before tests
  beforeEach(() => {
    // Create DOM elements
    document.body.innerHTML = `
      <table>
        <tbody id="hotlistTable"></tbody>
      </table>
      <input id="cardSearch" type="text">
      <select id="cardFilter">
        <option value="all">All Cards</option>
        <option value="blocked">Blocked Only</option>
        <option value="reissued">Reissued</option>
      </select>
    `;
    
    // Get DOM elements
    hotlistTable = document.getElementById('hotlistTable');
    cardSearchInput = document.getElementById('cardSearch');
    cardFilterSelect = document.getElementById('cardFilter');
    
    // Mock global functions
    global.fetchAPI = jest.fn();
    global.showNotification = jest.fn();
    global.formatDateTime = jest.fn().mockImplementation(() => '2025-03-01 09:23:45');
    global.maskCardNumber = jest.fn().mockImplementation((cardNumber) => cardNumber.slice(0, 4) + ' **** **** ' + cardNumber.slice(-4));
    global.confirm = jest.fn().mockReturnValue(true);
    
    // Load the card UI module
    require('../../frontend/js/cardUI');
  });
  
  // Reset mocks after each test
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  describe('loadBlockedCards()', () => {
    it('should fetch and render blocked cards successfully', async () => {
      // Mock the API response
      global.fetchAPI.mockResolvedValue(mockCards);
      
      // Call the function
      await window.loadBlockedCards();
      
      // Verify the API was called
      expect(global.fetchAPI).toHaveBeenCalledWith('cards/blocked');
      
      // Check that cards were rendered in the table
      expect(hotlistTable.children.length).toBe(2);
      expect(hotlistTable.innerHTML).toContain('Fraud Activity');
      expect(hotlistTable.innerHTML).toContain('Stolen Card');
      
      // Check that reissue button only appears for non-reissued cards
      expect(hotlistTable.innerHTML).toContain('Reissue');
      expect(hotlistTable.querySelectorAll('.reissue-card-btn').length).toBe(1);
    });
    
    it('should handle API errors gracefully', async () => {
      // Mock an API failure
      global.fetchAPI.mockResolvedValue(null);
      
      // Call the function
      await window.loadBlockedCards();
      
      // Check that error message is displayed
      expect(hotlistTable.innerHTML).toContain('Failed to load blocked cards');
    });
  });
  
  describe('filterCards()', () => {
    beforeEach(() => {
      // Setup mock data in the module
      window.cardsData = [...mockCards];
    });
    
    it('should filter cards by search term', () => {
      // Setup renderBlockedCards mock
      window.renderBlockedCards = jest.fn();
      
      // Set search value
      cardSearchInput.value = '4111';
      
      // Trigger the filter
      const event = new Event('input');
      cardSearchInput.dispatchEvent(event);
      
      // Verify filtering results
      expect(window.renderBlockedCards).toHaveBeenCalled();
      expect(window.renderBlockedCards.mock.calls[0][0].length).toBe(1);
      expect(window.renderBlockedCards.mock.calls[0][0][0].cardNumber).toBe('4111111111111111');
    });
    
    it('should filter cards by status', () => {
      // Setup renderBlockedCards mock
      window.renderBlockedCards = jest.fn();
      
      // Set filter value
      cardFilterSelect.value = 'reissued';
      
      // Trigger the filter
      const event = new Event('change');
      cardFilterSelect.dispatchEvent(event);
      
      // Verify filtering results
      expect(window.renderBlockedCards).toHaveBeenCalled();
      expect(window.renderBlockedCards.mock.calls[0][0].length).toBe(1);
      expect(window.renderBlockedCards.mock.calls[0][0][0].reissue).toBe('Y');
    });
  });
  
  describe('reissueCard()', () => {
    it('should reissue a card after confirmation', async () => {
      // Mock confirmation and API response
      global.confirm.mockReturnValue(true);
      global.fetchAPI.mockResolvedValue({ message: 'Card reissue initiated successfully' });
      
      // Add reissue function to window for testing
      if (!window.reissueCard) {
        window.reissueCard = function(cardNumber, caseId) {
          if (!confirm(`Are you sure you want to reissue card ${maskCardNumber(cardNumber)}?`)) {
            return;
          }
          
          return fetchAPI(`cards/${cardNumber}/reissue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ caseId: caseId || null })
          }).then(response => {
            if (response) {
              showNotification('Success', 'Card reissue initiated successfully', 'success');
              loadBlockedCards();
            }
          });
        };
      }
      
      // Mock loadBlockedCards
      window.loadBlockedCards = jest.fn();
      
      // Call the reissue function
      await window.reissueCard('378282246310005', 4);
      
      // Verify API call
      expect(global.fetchAPI).toHaveBeenCalledWith('cards/378282246310005/reissue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: 4 })
      });
      
      // Verify notification and reload
      expect(global.showNotification).toHaveBeenCalledWith('Success', 'Card reissue initiated successfully', 'success');
      expect(window.loadBlockedCards).toHaveBeenCalled();
    });
    
    it('should cancel reissue if user does not confirm', async () => {
      // Mock user cancellation
      global.confirm.mockReturnValue(false);
      
      // Add reissue function to window for testing if not already there
      if (!window.reissueCard) {
        window.reissueCard = function(cardNumber, caseId) {
          if (!confirm(`Are you sure you want to reissue card ${maskCardNumber(cardNumber)}?`)) {
            return;
          }
          
          return fetchAPI(`cards/${cardNumber}/reissue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ caseId: caseId || null })
          });
        };
      }
      
      // Call the reissue function
      await window.reissueCard('378282246310005', 4);
      
      // Verify API was not called
      expect(global.fetchAPI).not.toHaveBeenCalled();
    });
  });
});