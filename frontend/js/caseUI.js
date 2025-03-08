const CaseUI = {
    init() {
        this.caseForm = document.getElementById('createCaseForm');
        this.setupEventListeners();
    },

    setupEventListeners() {
        this.caseForm.addEventListener('submit', this.handleCaseSubmit.bind(this));
    },

    async handleCaseSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const caseData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/cases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(caseData)
            });

            if (response.ok) {
                const newCase = await response.json();
                this.displaySuccessMessage(newCase);
                event.target.reset();
            } else {
                throw new Error('Failed to create case');
            }
        } catch (error) {
            this.displayErrorMessage(error);
        }
    },

    createCaseFromAlert(alertId) {
        const alertIdField = this.caseForm.querySelector('#alertId');
        alertIdField.value = alertId;
        this.caseForm.querySelector('#description').focus();
    },

    displaySuccessMessage(newCase) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('bg-green-100', 'text-green-800', 'p-4', 'rounded', 'mt-4');
        messageContainer.textContent = `Case ${newCase.id} created successfully.`;
        this.caseForm.appendChild(messageContainer);
        
        setTimeout(() => messageContainer.remove(), 3000);
    },

    displayErrorMessage(error) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('bg-red-100', 'text-red-800', 'p-4', 'rounded', 'mt-4');
        messageContainer.textContent = `Error: ${error.message}`;
        this.caseForm.appendChild(messageContainer);
        
        setTimeout(() => messageContainer.remove(), 3000);
    }
};