import { fireEvent } from '@testing-library/dom';
import CaseUI from '../../frontend/js/caseUI';

describe('CaseUI', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="createCaseForm">
        <input id="alertId" name="alertId">
        <textarea id="description" name="description"></textarea>
        <button type="submit">Create Case</button>
      </form>
    `;
    CaseUI.init();
  });

  test('creates case from alert', () => {
    const alertId = 'TXN20250301001';
    CaseUI.createCaseFromAlert(alertId);

    const alertIdField = document.getElementById('alertId');
    expect(alertIdField.value).toBe(alertId);
  });
});