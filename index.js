import express from 'express';
import fetch from 'node-fetch';
import redis from 'redis';

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redisClient = redis.createClient({
  url: `redis://localhost:${REDIS_PORT}`,
});
redisClient.connect();
redisClient.on('connect', () => {
  console.log(`Connected to Redis on PORT ${REDIS_PORT}`);
});

const app = express();

function createResponse(username, publicReposNumber) {
  return `<h2>${username} has ${publicReposNumber} GitHub public repos</h2>`;
}

// Request GitHub for data
async function getPublicReposNumber(req, res, next) {
  try {
    console.log('Fetching data!');

    const { username } = req.params;

    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();

    // Cache the public repos number to redis for 1 hour
    const publicReposNumber = data.public_repos;
    redisClient.setEx(username, 3600, publicReposNumber);

    res.send(createResponse(username, publicReposNumber));
  } catch (error) {
    console.error(error);
    res.status(500);
  }
}

// Cache middleware
async function cache(req, res, next) {
  const { username } = req.params;

  try {
    const publicReposNumber = await redisClient.get(username);

    if (publicReposNumber !== null) {
      res.send(createResponse(username, publicReposNumber));
    } else {
      // Value was not cached. Move on to the next middleware
      next();
    }
  } catch (error) {
    throw error;
  }
}

app.get('/repos/:username', cache, getPublicReposNumber);

app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));
