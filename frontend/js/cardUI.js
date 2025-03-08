const CardUI = {
    init() {
        // Initialize any card-related UI components
    },

    async blockCard(cardNumber) {
        try {
            const response = await fetch('/api/cards/block', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cardNumber })
            });

            if (response.ok) {
                const blockedCard = await response.json();
                this.displayBlockConfirmation(blockedCard);
            } else {
                throw new Error('Failed to block card');
            }
        } catch (error) {
            this.displayBlockError(error);
        }
    },

    async reissueCard(cardNumber, customerId) {
        try {
            const response = await fetch('/api/cards/reissue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cardNumber, customerId })
            });

            if (response.ok) {
                const newCard = await response.json();
                this.displayReissueConfirmation(newCard);
            } else {
                throw new Error('Failed to reissue card');
            }
        } catch (error) {
            this.displayReissueError(error);
        }
    },

    displayBlockConfirmation(blockedCard) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('bg-red-100', 'text-red-800', 'p-4', 'rounded', 'fixed', 'top-4', 'right-4', 'z-50');
        messageContainer.textContent = `Card ending in ${blockedCard.cardNumber.slice(-4)} has been blocked.`;
        document.body.appendChild(messageContainer);
        
        setTimeout(() => messageContainer.remove(), 3000);
    },

    displayBlockError(error) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('bg-red-200', 'text-red-900', 'p-4', 'rounded', 'fixed', 'top-4', 'right-4', 'z-50');
        messageContainer.textContent = `Error blocking card: ${error.message}`;
        document.body.appendChild(messageContainer);
        
        setTimeout(() => messageContainer.remove(), 3000);
    },

    displayReissueConfirmation(newCard) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('bg-green-100', 'text-green-800', 'p-4', 'rounded', 'fixed', 'top-4', 'right-4', 'z-50');
        messageContainer.textContent = `New card issued. Last 4 digits: ${newCard.cardNumber.slice(-4)}`;
        document.body.appendChild(messageContainer);
        
        setTimeout(() => messageContainer.remove(), 3000);
    },

    displayReissueError(error) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('bg-red-200', 'text-red-900', 'p-4', 'rounded', 'fixed', 'top-4', 'right-4', 'z-50');
        messageContainer.textContent = `Error reissuing card: ${error.message}`;
        document.body.appendChild(messageContainer);
        
        setTimeout(() => messageContainer.remove(), 3000);
    }
};