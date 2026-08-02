# BluePeak Capital

Complete investment management platform scaffold using the design system in `../stitch_fxpro_invest_fintech_platform`.

## Apps

- Frontend: Next.js App Router at `http://localhost:3000`
- Backend API: NestJS at `http://localhost:4000`
- Swagger: `http://localhost:4000/api/docs`
- Database: PostgreSQL at `localhost:5433`

## Run

```bash
cp .env.example .env
docker compose up --build
```

## Database

```bash
cd backend
npm run migration:run
npm run seed:users
```

Seeded accounts:

- `investor@bluepeakcapital.com`
- `admin@bluepeakcapital.com`
- `super@bluepeakcapital.com`

Initial password: `ChangeMe123!`

Admin accounts are marked `mustChangePassword`.

## Implemented Areas

- Public website and policy pages
- Investor auth, registration, password reset, dashboard routes
- Admin auth and dashboard routes in the same frontend
- Role and permission based navigation
- JWT access tokens and persistent rotating refresh sessions
- PostgreSQL/TypeORM entities and initial migration
- Deposit approval with investment creation, Decimal.js return calculation, transaction log, notification, referral commission, and audit log
- Withdrawal reservation and admin approval/process/pay/reject workflow
- Scheduled weekly profit processor
- Wallet addresses, referrals, notifications, reports, settings, audit logs, uploads, and health endpoints
