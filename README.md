# Dot: The Texas Tribune's pixel tracker

This app produces a small pixel to include in republished content. The pixel, which is issued with a JSON Web Token to ensure integrity, sends back data that is displayed in a dashboard.

## Technology used

- Node
- Express
- TypeScript
- Postgres
- Auth0
- GraphQL
- Sequelize
- Vue
- Vuetify
- Vuex
- Vue Router

## Environment variables

| Variable                             |               Example |
| ------------------------------------ | --------------------: |
| `ACCESS_ID`                          |    secret-char-string |
| `APP_URL`                            | http://localhost:3000 |
| `AUTH0_CLIENT_ID`                    |                       |
| `AUTH0_CLIENT_SECRET`                |                       |
| `AUTH0_DOMAIN`                       |            domain.com |
| `AWS_ACCESS_KEY_ID`                  |                       |
| `AWS_SECRET_ACCESS_KEY`              |                       |
| `DB_HOST`                            |                dot-db |
| `DB_NAME`                            |                   dot |
| `DB_PASSWORD`                        |              postgres |
| `DB_PORT`                            |                  5432 |
| `DB_USER`                            |              postgres |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`       |                       |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` |                       |
| `GOOGLE_SPREADSHEET_ID`              |                       |
| `NODE_ENV`                           |           development |
| `NODE_PORT`                          |                  3000 |
| `TRACKER_JWT_SECRET`                 |          HS256 secret |
| `ENABLE_SENTRY`                      |            true/false |
| `SENTRY_DSN`                         |                       |
| `SENTRY_ENVIRONMENT`                 |           development |
| `VUETIFY_NONCE`                      |           noncestring |

### More detail

- `ACCESS_ID`: A random string of characters that allows applications to request pixels by including this value in the `Authorization` header. We will likely transition this process to Auth0 machine-to-machine applications.
- `APP_URL`: The protocol and domain (no trailing slash) at which you'll be running Dot. This will likely differ by environment.
- `NODE_ENV`: The recommended values for this are `development`, `production` or `staging`. This variable determines whether Webpack will auto-rebuild and how Sequelize connects to Postgres, among other things.
- `TRACKER_JWT_SECRET`: A secret for hashing the JSON Web Token that will be distributed with each pixel.
- `VUETIFY_NONCE`: A nonce to include in the Content Security Policy response header so that [Vuetify can inject embedded styles](https://vuetifyjs.com/en/customization/th%C3%A8me/#csp-nonce) into the page.

## Commands

To run the app locally:

1. `make db-refresh -f Makefile.dev`: Using your AWS credentials, this loads a dump of the production database into your local environment.
2. `make -f Makefile.dev`: Build the Docker image locally, and run a container with `bash` as the entrypoint.
3. `npm run build`: Compile JavaScript using Webpack and TypeScript.
4. `npm run start:watch`: Run the app, using Nodemon to watch for Node file changes and Webpack Dev Middleware to watch for front-end file changes.
5. Visit `/dashboard/`.

Other commands:

- `npm run lint`: Run ESlint checks on `.js`, `.ts` and `.vue` files.
- `npm run release`: Create a tagged GitHub release. Run this command _outside_ of the Docker container.

## How Dot works

Applications (most likely your CMS) that want to distribute tracking pixels along with republishable articles need to make an API call to acquire the markup for the pixel. This request should be made from the server as it involves an authorization secret.

```
GET /api/v2/trackers/?canonical=<canonical>&source=<source>
Authorization: Bearer <access ID>
```

- _Canonical_: The canonical URL of the article
- _Source_: An enum value describing from where the article is being distributed.
- _Access ID_: The `ACCESS_ID` value described above

A successful request will return a fully formed pixel to distribute along with the republishable article. It includes a JSON Web Token containing some metadata about the article. The generation of this JWT is why an authorization header is required: It is hashed with a secret, meaning the data it contains can't be altered. This helps ensure the integrity of collected information.

The script tag also contains a [subresource-integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) hash. This hash, among other reasons, is why this app has hard semantic versioning.

Once the pixel is embedded in republishers' source code, it will make a request that includes a query parameter with the issued JWT. This data is decoded on the server and inserted into Postgres.

A GraphQL API reads from the database and provides JSON that powers the dashboard.

## Accessing API data

Only certain users are authorized to read from this app's GraphQL API. This is handled via [Auth0 permissions](https://auth0.com/docs/authorization/guides/manage-permissions). Once granted, the necessary permissions will appear in users' access tokens.

## Migrations

We use Sequelize to handle migrations. Note that, if you're running these locally, you'll want to do an `npm run build` first. This ensures that the migration files are compiled from TypeScript to plain JavaScript.

Migration scripts are located in `server/migrations/`. To run migrations up to a certain point, do `npx sequelize-cli db:migrate --to <name-of-migration>.js`. Or, to run all lingering ones, simply do `npx sequelize-cli db:migrate`.

## Google Spreadsheets integration

This project includes a Sequelize seeder for baking out collected data into a Google Spreadsheet. By default, it'll produce stats for the previous day, but the date range is adjustable.

The excellent `node-google-spreadsheet` [package](https://theoephraim.github.io/node-google-spreadsheet/#/) powers this task. It assumes you're authenticating via [service account](https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account) and thus you'll need the `GOOGLE_*` environment variables referenced above.

To run the seeder: `npx sequelize-cli db:seed --seed to-spreadsheet.js`. If you're running it locally, you'll want to do `npm run build:server` first.

## Deploying to production

We recommend building an image from the included `Dockerfile`, then running that image inside a container on the production server. You should also have a command that builds the image but overrides the default entrypoint and enters you into a bash shell. From there, you can run database migrations.

For more information/to get a sample production `Makefile`, please contact The Texas Tribune.

## License

MIT
