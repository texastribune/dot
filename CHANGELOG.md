# Change log

## v2.3.0

### Improvements

- Add client-side error handling with Sentry
- Use GET requests for GraphQL queries
- Include IP address in access logs
- Add proper error page for HTML routes
- Add default cache time for all unauthorized requests
- Add more detail to GraphQL errors
- Create no-cache middleware

### Chores

- Move Axios configuration to separate file that client and server can share
- Simplify server-side error classes
- Create `logError` utility that is separate from `reportError`

## v2.2.0

### Improvements

- Reset date picker every time it's opened
- Max out date picker at today
- Make `manual` a valid tracker source

### Chores

- Consolidate Sequelize configs
- Simplify tracking script's reference to itself
- Moves enums from `*types.ts` files to `*config.ts` files

## v2.1.0

### Security

- Removes tracking scripts for versions below 2.1.0
- Refactors tracking script so `data-dot-url` is no longer needed
- Fixes some vulnerabilities flagged by GitHub

### Improvements

- Adds `async` attribute to distributed tracker scripts
- Updates README.md
- Adds CHANGELOG.md

### Chores

- Deletes two no-longer-needed data-migration scripts from `server/seeders/`
- `410`s tracker assets from v1
