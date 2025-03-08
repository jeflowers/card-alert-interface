# Card Alert Interface

## Project Overview

The Card Alert Interface is a comprehensive fraud analytics system designed to detect, process, and manage suspicious card transactions efficiently.

## Features

- Suspect Transaction Processing
- Case Management
- Card Block & Reissue Workflow
- Fraud Export Capabilities

## Prerequisites

- Node.js (v16+ recommended)
- Oracle Database
- npm or Yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/jeflowers/card-alert-interface.git
   cd card-alert-interface
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the configuration with your specific database and system settings

4. Database Setup
   - Run database scripts in `database/schema.sql`
   - Populate initial data using `database/seed.sql`

5. Start the application:
   ```
   npm run start:dev
   ```

## Project Structure

- `backend/`: Node.js/Express backend
- `frontend/`: HTML, JavaScript, and Tailwind CSS frontend
- `database/`: Database schemas and seed data
- `docs/`: Project documentation
- `tests/`: Unit and integration tests

## Testing

```
npm test
```

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.