const API_ROOT = 'https://www.reddit.com';

// Rate limiting: Reddit allows 10 requests per minute for free API usage
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 6500; // ~9 requests per minute to stay safe

const rateLimitedFetch = async (url) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();

  const response = await fetch(url);

  if (response.status === 429) {
    throw new Error('Rate limited by Reddit. Please wait a moment and try again.');
  }

  if (!response.ok) {
    throw new Error(`Reddit API error: ${response.status}`);
  }

  return response.json();
};

export const getSubredditPosts = async (subreddit) => {
  const data = await rateLimitedFetch(`${API_ROOT}/r/${subreddit}.json?limit=25`);
  return data.data.children.map((post) => post.data);
};

export const getPostComments = async (permalink) => {
  const data = await rateLimitedFetch(`${API_ROOT}${permalink}.json`);
  return data[1].data.children.map((comment) => comment.data);
};

export const searchPosts = async (searchTerm) => {
  const data = await rateLimitedFetch(
    `${API_ROOT}/search.json?q=${encodeURIComponent(searchTerm)}&limit=25`
  );
  return data.data.children.map((post) => post.data);
};

export const getSubreddits = async () => {
  const data = await rateLimitedFetch(`${API_ROOT}/subreddits/popular.json?limit=20`);
  return data.data.children.map((sub) => sub.data);
};

export const getPopularPosts = async () => {
  const data = await rateLimitedFetch(`${API_ROOT}/r/popular.json?limit=25`);
  return data.data.children.map((post) => post.data);
};
