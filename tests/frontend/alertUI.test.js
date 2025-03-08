import { fireEvent } from '@testing-library/dom';
import AlertUI from '../../frontend/js/alertUI';

describe('AlertUI', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="alertsList"></div>
    `;
  });

  test('renders alerts correctly', () => {
    const mockAlerts = [{
      transaction_id: 'TXN20250301001',
      card_number: '4111222233334444',
      merchant_name: 'Online Retailer',
      amount: 750.50,
      timestamp: new Date().toISOString()
    }];

    AlertUI.renderAlerts(mockAlerts);

    const alertElements = document.querySelectorAll('.card');
    expect(alertElements.length).toBe(1);
    expect(alertElements[0].textContent).toContain('Online Retailer');
    expect(alertElements[0].textContent).toContain('$750.50');
  });
});