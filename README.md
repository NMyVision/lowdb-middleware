# LowDB Middleware

Forked version of [JSON Server](https://github.com/typicode/json-server). This package is intended to used as middleware from within an ExpressJS application.

## Roadmap

- [x] Update packages to latest versions
- [x] Drop CLI support
- [x] Rewrite code base to use ES6 style code ie: import fs from 'fs
- [x] Add API hooks
- [ ] Basic Auth plugin
- [x] Database management endpoints
- [x] Add dynamic databases routes
- [ ] Use FileAsync via async/await 
- [ ] Configurable setup
- [ ] Snapshots / Restore

## Fixes / Enhancements 

The following PRs were implemented from json-server repository

- [x] Fix bug with null expand reference. [PR640](https://github.com/typicode/json-server/pull/640/commits)
- [x] Add `_contains` operation [PR691](https://github.com/typicode/json-server/pull/691/commits)
- [x] Add `_attr` option to reduce query context [PR558](https://github.com/typicode/json-server/pull/558/commits)
- [x] Add `_flatten` option to flatten nested objects
- [x] Add `_keys` option to reduce returned results


## Example usage

Legacy database setup
`app.use('/test', middleware.staticRouter("./databases/test.json"))`

New dynamic database setup
`app.use('/api', middleware.dynamicRouter())`

structure is
`/api/{databasename}/{collection} => /api/application/users`

## Database management

List dynamic databases
`GET /api/db`

Create new databases
`POST /api/db`

Modify existing database
`PATCH /api/db`

Documenation coming....
