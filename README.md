# Redis cache with express

## About

An express server for fetching the number of public GitHub repos of any given username.

The public repos number of the user are cached on a local Redis server.

## Features

Thanks to caching, the GitHub API is called only the first time for a given username. Thereafter, the response is taken from Redis. This reduces the response time (in my local environment, from ~1200ms to ~20ms).

The cache has an expiration time of one hour, which means that the cache value is discarded after one hour.

## Running

Clone the repo and run either `npm start` (or `npm run dev` for using `nodemon`).

## Acknowledgment

Thanks to [Brad Traversy](https://github.com/bradtraversy) for his [tutorial](https://www.youtube.com/watch?v=oaJq1mQ3dFI&list=PLillGF-RfqbZ2ybcoD2OaabW2P7Ws8CWu&index=14).
