# Blog App

# Run docker for Production

1. Copy [.env.prod.example](./.env.prod.example) file value to [.env](./.env) file
2. Build and start docker

```bash
npm run docker-compose-up:prod
```

> **Note:** this will start docker for application server and postgres database

3. Perform database migration and seeding (inside docker terminal)

```bash
npm run database:migrate-and-seed
```