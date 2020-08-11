# Change log

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
