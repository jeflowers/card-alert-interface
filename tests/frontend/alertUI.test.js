/**
 * Test suite for Alert UI functionality
 */

describe('Alert UI', () => {
  // DOM elements
  let alertsTable;
  let alertSearchInput;
  let alertFilterSelect;
  let alertModal;
  let createCaseBtn;
  
  // Mock data
  const mockAlerts = [
    {
      id: 1,
      accountNumber: '4111111111111111',
      transactionDate: '2025-03-01',
      transactionTime: '09:23:45',
      transactionAmount: 599.99,
      merchantName: 'BEST ELECTRONICS',
      merchantCity: 'NEW YORK',
      merchantState: 'NY',
      merchantCountry: '840',
      posEntryMode: 'S',
      cased: 'N'
    },
    {
      id: 2,
      accountNumber: '5555555555554444',
      transactionDate: '2025-03-02',
      transactionTime: '14:32:17',
      transactionAmount: 129.99,
      merchantName: 'LUXURY RESTAURANT',
      merchantCity: 'MIAMI',
      merchantState: 'FL',
      merchantCountry: '840',
      posEntryMode: 'E',
      cased: 'Y'
    }
  ];
  
  // Setup before tests
  beforeEach(() => {
    // Create DOM elements
    document.body.innerHTML = `
      <table>
        <tbody id="alertsTable"></tbody>
      </table>
      <input id="alertSearch" type="text">
      <select id="alertFilter">
        <option value="all">All Alerts</option>
        <option value="new">New</option>
        <option value="cased">Cased</option>
      </select>
      <div id="alertModal" class="modal hidden">
        <div id="alertModalContent"></div>
      </div>
      <button id="createCaseBtn">Create Case</button>
    `;
    
    // Get DOM elements
    alertsTable = document.getElementById('alertsTable');
    alertSearchInput = document.getElementById('alertSearch');
    alertFilterSelect = document.getElementById('alertFilter');
    alertModal = document.getElementById('alertModal');
    createCaseBtn = document.getElementById('createCaseBtn');
    
    // Mock global functions
    global.fetchAPI = jest.fn();
    global.showModal = jest.fn();
    global.hideModal = jest.fn();
    global.showNotification = jest.fn();
    global.formatDateTime = jest.fn().mockImplementation(() => '2025-03-01 09:23:45');
    global.formatCurrency = jest.fn().mockImplementation((amount) => `$${amount}`);
    global.maskCardNumber = jest.fn().mockImplementation((cardNumber) => cardNumber.slice(0, 4) + ' **** **** ' + cardNumber.slice(-4));
    
    // Load the alert UI module
    require('../../frontend/js/alertUI');
  });
  
  // Reset mocks after each test
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  describe('loadAlerts()', () => {
    it('should fetch and render alerts successfully', async () => {
      // Mock the API response
      global.fetchAPI.mockResolvedValue(mockAlerts);
      
      // Call the function
      await window.loadAlerts();
      
      // Verify the API was called
      expect(global.fetchAPI).toHaveBeenCalledWith('alerts');
      
      // Check that alerts were rendered in the table
      expect(alertsTable.children.length).toBe(2);
      expect(alertsTable.innerHTML).toContain('BEST ELECTRONICS');
      expect(alertsTable.innerHTML).toContain('LUXURY RESTAURANT');
    });
    
    it('should handle API errors gracefully', async () => {
      // Mock an API failure
      global.fetchAPI.mockResolvedValue(null);
      
      // Call the function
      await window.loadAlerts();
      
      // Check that error message is displayed
      expect(alertsTable.innerHTML).toContain('Failed to load alerts');
    });
  });
  
  describe('filterAlerts()', () => {
    beforeEach(() => {
      // Setup mock data in the module
      window.alertsData = [...mockAlerts];
    });
    
    it('should filter alerts by search term', () => {
      // Set search value
      alertSearchInput.value = 'elect';
      
      // Trigger the filter
      const event = new Event('input');
      alertSearchInput.dispatchEvent(event);
      
      // Verify filtering results
      expect(alertsTable.children.length).toBe(1);
      expect(alertsTable.innerHTML).toContain('BEST ELECTRONICS');
      expect(alertsTable.innerHTML).not.toContain('LUXURY RESTAURANT');
    });
    
    it('should filter alerts by status', () => {
      // Set filter value
      alertFilterSelect.value = 'cased';
      
      // Trigger the filter
      const event = new Event('change');
      alertFilterSelect.dispatchEvent(event);
      
      // Verify filtering results
      expect(alertsTable.children.length).toBe(1);
      expect(alertsTable.innerHTML).toContain('LUXURY RESTAURANT');
      expect(alertsTable.innerHTML).not.toContain('BEST ELECTRONICS');
    });
  });
  
  describe('viewAlert()', () => {
    it('should display alert details in the modal', async () => {
      // Mock API response for a single alert
      global.fetchAPI.mockResolvedValue(mockAlerts[0]);
      
      // Get the viewAlert function reference
      const viewAlertFn = global.viewAlert || window.viewAlert;
      
      // Call the function with an alert ID
      await viewAlertFn(1);
      
      // Verify API call
      expect(global.fetchAPI).toHaveBeenCalledWith('alerts/1');
      
      // Verify modal was shown
      expect(global.showModal).toHaveBeenCalledWith(alertModal);
      
      // Check modal content
      expect(document.getElementById('alertModalContent').innerHTML).toContain('BEST ELECTRONICS');
    });
    
    it('should show create case form when in create case mode', async () => {
      // Mock API response for a single alert
      global.fetchAPI.mockResolvedValue(mockAlerts[0]);
      
      // Get the viewAlert function reference
      const viewAlertFn = global.viewAlert || window.viewAlert;
      
      // Call the function with an alert ID and createCaseMode=true
      await viewAlertFn(1, true);
      
      // Check that the create case form is displayed
      expect(document.getElementById('alertModalContent').innerHTML).toContain('Create Fraud Case');
      expect(createCaseBtn.style.display).toBe('block');
    });
  });
});