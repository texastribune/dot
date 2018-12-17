**Note for non-Texas Tribune users**: We're happy to answer questions about this app, but there are no current plans to adopt a release schedule or offer official support. We will certainly be making improvements as time goes on, though, so check back.

# Dot
The Texas Tribune's pixel tracking tool.


## How it works
A tiny script creates a 1x1 image on the hosting page. Attached to the image `src` are query parameters with meta about that page. Thus, when the client makes a request for the `src`, it sends along those parameters and records them in a PostgreSQL database. This means that, in addition to knowing who's republishing Texas Tribune stories, we can get a rough page-view count of those reprinted stories.

### The script tag
```
<script
  data-tt-canonical="<CANONICAL>"
  integrity="<SRI_HASH>"
  src="https://dot.texastribune.org/static/dist/dot.min.[WEBPACK_HASH].js"
  crossorigin="anonymous"
>
</script>
```

The `data-tt-canonical` attribute should be a full URL that includes the protocol, domain and path. For example, `https://www.texastribune.org/2018/03/09/slug-goes-here` or `https://apps.texastribune.org/path-goes-here`. The important thing is that it contain "texastribune" somewhere.

See "Building the tracker script" below for more information about the SRI hash.

### The image request
If we need to track views in an environment that doesn't support JavaScript, it's possible to use an image tag directly:
`<img src="https://dot.texastribune.org/dot.gif?url=<URL>&canonical=<CANONICAL>&query=<QUERY>&ref=<REF>">`
+ `url`: The republished page's URL (it must include the protocol, domain and path)
+ `canonical`: The Texas Tribune URL (it must include the protocol, domain and path, as well as "texastribune")
+ `query`: Any query parameters attached to the republished page's URL
+ `ref`: The [referrer](https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer) to the republished page

Even if a value is blank, include it as an empty query parameter:
`<img src="https://dot.texastribune.org/dot.gif?query=&ref=&url=http://www.foo.com&canonical=https://texastribune.org/03/08/2018/slug-here">`


## What's inside
Below are the main technologies used in the app. The **only** thing you need installed on your machine is Docker. The build process, detailed below in "setup," handles the rest.

+ [Express](https://expressjs.com/)
+ [Node Postgres](https://github.com/brianc/node-postgres)
+ Vue.js
+ [Apollo](https://www.apollographql.com/)
+ GraphQL
+ [Sentry/Raven](https://github.com/getsentry/raven-js) (this could be removed or swapped with a different error-handling service)


## Setup
These steps assume you have Docker installed on your machine.

1. Create an `env` file in the root and fill it out according to what's in `env.sample`.
3. `make db-refresh -f Makefile.dev`. This pulls down a copy of the production database for use locally. Check out this [repository](https://github.com/texastribune/docker-pg-tools) for info about how to set up a database export (assuming you're using AWS/S3).
4. `make -f Makefile.dev`. This will trigger a Docker build and drop you inside a container. All dependencies will be installed with Yarn.


## Where stuff lives
+ `server/`: The Express configuration, including routing, middleware and error handling
+ `tracker/`: The source files for the tracking script. This includes a Webpack configuration.
+ `dashboard/`: The visual dashboard, powered by Vue.js and Apollo. This includes a Webpack configuration.
+ `graphql/`: The GraphQL API, powered by Express and Apollo


## Important URLs
+ `/dashboard`: The visual dashboard.
+ `/test`: An HTML page containing a development build of the tracker script (meaning it will not insert rows into the production database). Useful for debugging [development only].
+ `/dot.gif?<params>`: The endpoint for retrieving the image `src` and inserting republisher info into the database.
+ `/graphql`: The API. Given it's GraphQL, all endpoints use `POST`.


## Commands

### Development
+ `yarn run dash:dev`: Start development mode for the dashboard. Webpack's hot module replacement is enabled, meaning you can make changes to files in `dashboard/*` and see them update live at `/dashboard`.
+ `yarn run tracker:dev`: Fire up development mode for the tracker-script portion of the app (which you can test at `/test`). Changes to files in `tracker/*` or `server/*` should trigger automatic rebuilds.

### Production
#### Commands
+ `yarn run start:prod`: Start the server.
+ `yarn run dash:prod:webpack`: Build the production bundle for the dashboard.
+ `yarn run tracker:prod:webpack`: Build a new production version of the tracker script. See section below.


## Building the tracker script
To give republishers [SRI protection](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity), production builds of the tracker script are:
1. Version controlled
2. Uniquely hashed
3. Built locally

If you change anything in `tracker/src/`, run `yarn run tracker:prod:webpack`. Webpack will notice the bundle has changed and thus build a new uniquely hashed file into `tracker/public/dist`. **Make sure to commit it and its source map**.

After you've deployed the new script, put its URL into this [website](https://www.srihash.org/) to get an integrity key.

Finally, update the pixel-tracker variables for texastribune.org.

Why this process? SRI integrity keys become invalid if the file they refer to has changed. So every time we update the logic of the tracker script, it's important to build a **new version** of it and pair it with a **new integrity key**. This means we should also never delete old builds of the pixel script.


## Deployment
Deployment assumes you have a `Makefile` on the production server that pulls `master` and starts a Docker build. `Makefile.example` in this project demonstrates a way to do this.


## License
MIT


## TODOs
+ Use Webpack to put vendor code into a separate bundle.
+ Use an ORM for GraphQL resolvers.
+ Give more detail to Sentry when error occurs.
+ Upgrade to Node v8.x
