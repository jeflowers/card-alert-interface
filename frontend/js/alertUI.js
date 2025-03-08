const AlertUI = {
    init() {
        this.alertsList = document.getElementById('alertsList');
        this.fetchAlerts();
        this.setupEventListeners();
    },

    async fetchAlerts() {
        try {
            const response = await fetch('/api/alerts');
            const alerts = await response.json();
            this.renderAlerts(alerts);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    },

    renderAlerts(alerts) {
        this.alertsList.innerHTML = alerts.map(alert => `
            <div class="card">
                <div class="flex justify-between items-center mb-2">
                    <span class="badge badge-suspicious">Suspicious</span>
                    <span class="text-sm text-gray-500">${new Date(alert.timestamp).toLocaleString()}</span>
                </div>
                <div class="space-y-2">
                    <p><strong>Transaction ID:</strong> ${alert.transaction_id}</p>
                    <p><strong>Card Number:</strong> ${alert.card_number.slice(-4).padStart(alert.card_number.length, '*')}</p>
                    <p><strong>Merchant:</strong> ${alert.merchant_name}</p>
                    <p><strong>Amount:</strong> $${alert.amount.toFixed(2)}</p>
                </div>
                <div class="mt-4 flex space-x-2">
                    <button class="btn-primary" onclick="CaseUI.createCaseFromAlert('${alert.transaction_id}')">Create Case</button>
                    <button class="btn-danger" onclick="CardUI.blockCard('${alert.card_number}')">Block Card</button>
                </div>
            </div>
        `).join('');
    },

    setupEventListeners() {
        // Additional event listeners can be added here
    }
};