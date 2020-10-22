# Dot: The Texas Tribune's pixel tracker

This app produces a small, non-invasive script that we distribute with our content. The script uses a JSON Web Token to send back data about who is republishing our articles, which we visualize in a dashboard.

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

| Variable                |                           Example |
| ----------------------- | --------------------------------: |
| `ACCESS_IDS`            | {"app-name":"secret-char-string"} |
| `APP_URL`               |             http://localhost:3000 |
| `AUTH0_CLIENT_ID`       |                                   |
| `AUTH0_CLIENT_SECRET`   |                                   |
| `AUTH0_DOMAIN`          |                        domain.com |
| `AWS_ACCESS_KEY_ID`     |                                   |
| `AWS_SECRET_ACCESS_KEY` |                                   |
| `DB_HOST`               |                            dot-db |
| `DB_NAME`               |                               dot |
| `DB_PASSWORD`           |                          postgres |
| `DB_PORT`               |                              5432 |
| `DB_USER`               |                          postgres |
| `NODE_ENV`              |                       development |
| `NODE_PORT`             |                              3000 |
| `TRACKER_JWT_SECRET`    |                      HS256 secret |
| `ENABLE_SENTRY`         |                        true/false |
| `SENTRY_DSN`            |                                   |
| `SENTRY_ENVIRONMENT`    |                       development |
| `VUETIFY_NONCE`         |                       noncestring |

### More detail

- `ACCESS_IDS`: This JSON string is a whitelist of apps that are authorized to make requests to Dot's tracking-script API. The key is an arbitrary descriptor of the requesting app's name. The value should be a hard-to-guess string of characters. We will likely transition this authorization to Auth0 machine-to-machine applications.
- `APP_URL`: The protocol and domain (no trailing slash) at which you'll be running Dot. This will likely differ by environment.
- `NODE_ENV`: The recommended values for this are `development`, `production` or `staging`. This variable determines whether Webpack will auto-rebuild and how Sequelize connects to Postgres, among other things.
- `TRACKER_JWT_SECRET`: A secret for hashing the JSON Web Token that will be distributed with each tracking script.
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

Applications (most likely your CMS) that want to distribute tracking scripts along with republishable articles need to make an API call to acquire the markup for the script. This request should be made from the server as it involves an authorization secret.

```
GET /api/v2/trackers/?canonical=<canonical>&source=<source>
Authorization: Bearer <access ID>
```

- _Canonical_: The canonical URL of the article
- _Source_: An enum value describing from where the article is being distributed.
- _Access ID_: One of the values in the `ACCESS_IDS` environment variable

A successful request will return a fully formed script tag to distribute along with the republishable article. It includes a data attribute whose value is a JSON Web Token containing some metadata about the article. The generation of this JWT is why an authorization header is required: It is hashed with a secret, meaning the data it contains can't be altered. This helps ensure the integrity of collected page views.

The script tag also contains a [subresource-integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) hash. This hash, among other reasons, is why this app has hard semantic versioning.

Once the tracking script is embedded in republishers' source code, it will create a 1x1 image on each page load. The request for this pixel will include a query parameter with the issued JWT. This data is decoded on the server and inserted into Postgres.

A GraphQL API reads from the database and provides JSON that powers the dashboard.

## Accessing API data

Only certain users are authorized to read from this app's GraphQL API. This is handled via [Auth0 permissions](https://auth0.com/docs/authorization/guides/manage-permissions). Once granted, the necessary permissions will appear in users' access tokens.

## Migrations

We use Sequelize to handle migrations. Note that, if you're running these locally, you'll want to do an `npm run build` first. This ensures that the migration files are compiled from TypeScript to plain JavaScript.

Schema-migration scripts are located in `server/migrations/`. To run schema migrations up to a certain point, do `npx sequelize-cli db:migrate --to <name-of-migration>.js`. Or, to run them all, simply do `npx sequelize-cli db:migrate`.

## Releases

This app is semantically versioned and uses the [`release-it`](https://github.com/release-it/release-it) package to create releases. You must have full repository permissions as well as `GITHUB_TOKEN=<personal access token>` in your terminal environment _outside_ of the Docker container.

To create a release, run `npm run release` outside of Docker. Answer "yes" to all the questions that follow. During the release, the contents of `tracker/pixel.js` will be copied and placed in `analytics/<version>/pixel.js`, where Express can serve them. This ensures we have a script per app version and can thus continue serving old versions while providing them with a valid SRI hash.

The `master` branch represents the current major version. All releases should be made from `master` save two scenarios: patches to previous versions and pre-releases of the next major version.

It's OK to make pre-releases from `master` to test on staging servers, but these should never be deployed to production. _Remnant pre-release scripts in `analytics/` should be deleted when making a new minor or patch release_.

The `next` branch represents the next major version. All pre-releases for the next major version should be made from this branch.

## Deploying to production

We recommended building an image from the included Dockerfile, then running that image inside a container on the production server. You should provide a command that overrides the default entrypoint and enters you into a bash shell. From there, you can run database migrations.

For more information/to get a sample production Makefile, please contact agibson@texastribune.org.

## License

MIT
