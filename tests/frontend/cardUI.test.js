import { fireEvent } from '@testing-library/dom';
import CardUI from '../../frontend/js/cardUI';

describe('CardUI', () => {
  test('blocks card successfully', async () => {
    const cardNumber = '4111222233334444';
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cardNumber, status: 'BLOCKED' })
      })
    );

    const messageContainer = document.createElement('div');
    document.body.appendChild(messageContainer);

    await CardUI.blockCard(cardNumber);

    const confirmationMessage = document.body.textContent;
    expect(confirmationMessage).toContain('Card ending in 4444 has been blocked');
  });
});