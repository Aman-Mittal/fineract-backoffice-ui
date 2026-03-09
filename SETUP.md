<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

# Project Setup Guide

This guide provides instructions for setting up the Fineract Backoffice UI development environment.

## Prerequisites

- **Node.js**: LTS version (v22.x or later).
- **npm**: v10.x or later.
- **Angular CLI**: v20.x or later.

## Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/apache/fineract-backoffice-ui.git
    cd fineract-backoffice-ui
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Local Helper Scripts

For convenience, the following scripts are provided for local development (Linux/macOS):

- **`./run-local.sh`**: One-step setup. Installs dependencies, generates local SSL certificates (using OpenSSL), and starts the server in HTTPS mode.
- **`./cleanup-local.sh`**: Safely stops background Angular processes and removes temporary build/SSL artifacts.

---

## Development

1.  **Secure Development (SSL)**:
    Since Fineract sandboxes often require HTTPS, run the following to set up local trusted certificates (requires `mkcert`):

    ```bash
    ./scripts/setup-ssl.sh
    ```

2.  **Run the application**:
    - **Local Development**:
      ```bash
      npm start
      ```
    - **Mifos Sandbox**:
      ```bash
      npm run start:sandbox
      ```
      Access the UI at `http://localhost:4200` (or `https://localhost:4200` if using SSL).

3.  **Connecting to a Sandbox**:
    Update `src/environments/environment.ts` with your sandbox URL:

    ```typescript
    fineractApiUrl: 'https://demo.mifos.io/fineract-provider/api/v1';
    ```

4.  **Run unit tests**:

    ```bash
    npm run test
    ```

5.  **Run linting**:

    ```bash
    npm run lint
    ```

6.  **Format code**:
    ```bash
    npm run format
    ```

## Docker Execution

1.  **Build and start container**:
    ```bash
    cd deploy
    docker-compose up --build
    ```
    Access the UI at `http://localhost:8080`.
