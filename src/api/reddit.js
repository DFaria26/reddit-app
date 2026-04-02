// Reddit blocks CORS from non-Reddit origins, so we proxy through corsproxy.io
const REDDIT_BASE = 'https://www.reddit.com';

const buildUrl = (path) => {
  return `https://corsproxy.io/?${encodeURIComponent(REDDIT_BASE + path)}`;
};

// Simple in-memory cache to reduce API calls and handle rate limits
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCached = (key) => {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Rate limiting: Reddit allows 10 requests per minute for free API usage
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 6500; // ~9 requests per minute to stay safe

const rateLimitedFetch = async (path) => {
  // Check cache first
  const cached = getCached(path);
  if (cached) return cached;

  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();

  const url = buildUrl(path);
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (response.status === 429) {
    throw new Error('Rate limited by Reddit. Please wait a moment and try again.');
  }

  if (!response.ok) {
    throw new Error(`Reddit API error: ${response.status}`);
  }

  const data = await response.json();
  setCache(path, data);
  return data;
};

export const getSubredditPosts = async (subreddit) => {
  const data = await rateLimitedFetch(`/r/${subreddit}.json?limit=25`);
  return data.data.children.map((post) => post.data);
};

export const getPostComments = async (permalink) => {
  const data = await rateLimitedFetch(`${permalink}.json`);
  return data[1].data.children.map((comment) => comment.data);
};

export const searchPosts = async (searchTerm) => {
  const data = await rateLimitedFetch(
    `/search.json?q=${encodeURIComponent(searchTerm)}&limit=25`
  );
  return data.data.children.map((post) => post.data);
};

export const getSubreddits = async () => {
  const data = await rateLimitedFetch(`/subreddits/popular.json?limit=20`);
  return data.data.children.map((sub) => sub.data);
};

export const getPopularPosts = async () => {
  const data = await rateLimitedFetch(`/r/popular.json?limit=25`);
  return data.data.children.map((post) => post.data);
};
