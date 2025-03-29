# TMS User Service

This service handles user-related functionality (e.g. authentication, registration) for the TMS platform.

---

## 🛠 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (for running local scripts or tests outside Docker)

---

## 🚀 Running the Service (Dev)

To run inside the full local stack:

```bash
cd ../tms-local-env
./docker-start.sh
```

This will spin up the `tms-user-service` along with the database and UI in a shared dev network.

To run **just the service**:

```bash
docker compose -f docker-compose.dev.yml up --build
```

> Make sure the `tms-net` Docker network is already created or sourced from the shared local env repo.

---

## 🧪 Running Tests

You can run unit tests inside the container with:

```bash
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
```

This will:

- Spin up the `tms-user-service` container
- Run `npm test`
- Use a test Postgres container defined in the test file

---

## 🧾 Environment Variables

The service uses a `.env` file to configure local development.

```env
PORT=4000
DATABASE_URL=postgres://tmsuser:tmspassword@db:5432/tmsdb
JWT_SECRET=somesecret
```

- `DATABASE_URL` must point to the correct Postgres host (usually `db` in Docker or `localhost` outside)
- `JWT_SECRET` is used for signing authentication tokens

---

## 📁 File Structure Overview

```
tms-user-service/
├── routes/            # Express route handlers
├── middleware/        # Express middleware (auth, error handling)
├── tests/             # Jest-based test files
├── db.js              # Postgres connection setup
├── server.js          # Entry point
├── .env               # Environment config
└── Dockerfile         # Docker build file
```

---

## 🐳 Docker Compose Files

- `docker-compose.dev.yml`: For dev mode with live reload
- `docker-compose.test.yml`: For running unit tests