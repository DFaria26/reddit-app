# RedditLite

A minimal Reddit client built with React and Redux that lets users browse, search, and read posts and comments from Reddit's JSON API.

## Wireframes

```
+------------------------------------------------------------------+
|  [Reddit Logo] RedditLite    [ Search Reddit...        ] [Search] |
+------------------------------------------------------------------+
|                                                                    |
|  SIDEBAR          |  MAIN CONTENT                                  |
|  +-----------+    |  +------------------------------------------+  |
|  | Subreddits|    |  | r/popular                    25 posts    |  |
|  |-----------|    |  +------------------------------------------+  |
|  | * Popular |    |  | [^] | r/subreddit * u/author * 2h ago    |  |
|  | r/funny   |    |  | 1.5k| Post Title Here                   |  |
|  | r/gaming  |    |  | [v] | [thumbnail image]                  |  |
|  | r/pics    |    |  |     | 42 Comments                        |  |
|  | r/news    |    |  +------------------------------------------+  |
|  | r/tech    |    |  | [^] | r/subreddit * u/author * 5h ago    |  |
|  | ...       |    |  | 890 | Another Post Title                 |  |
|  +-----------+    |  | [v] | 18 Comments                        |  |
|                   |  +------------------------------------------+  |
+------------------------------------------------------------------+

POST DETAIL MODAL (opens on click):
+------------------------------------------+
|                                     [X]  |
|  r/subreddit * u/author * 2h ago         |
|  Post Title Here                         |
|  [Discussion]                            |
|                                          |
|  [Post image / content / link]           |
|                                          |
|  ^ 1.5k  | 42 Comments                  |
|  ----------------------------------------|
|  Comments                                |
|  u/commenter1 * 1h ago * 25 pts         |
|  Comment text rendered as markdown...    |
|                                          |
|  u/commenter2 * 30m ago * 12 pts        |
|  Another comment here...                 |
+------------------------------------------+

MOBILE VIEW (<960px):
+-------------------------+
| RedditLite              |
| [Search Reddit...    ]  |
+-------------------------+
| [=] Subreddits          |
+-------------------------+
| [^] r/sub * u/auth * 2h |
| 1.5k Post Title Here    |
| [v]  42 Comments         |
+-------------------------+
| [^] r/sub * u/auth * 5h |
| 890  Another Post Title  |
| [v]  18 Comments         |
+-------------------------+
```

## Technologies Used

- **React** - UI component library
- **Redux Toolkit** - State management with async thunks
- **React Redux** - React bindings for Redux
- **React Markdown** - Render Reddit markdown content (comments, self-posts)
- **Remark GFM** - GitHub Flavored Markdown support
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **Create React App** - Build tooling and dev server
- **Reddit JSON API** - Data source (no auth required)

## Features

- **Browse Popular Posts** - See trending content from r/popular on initial load
- **Search Reddit** - Full-text search across all of Reddit
- **Filter by Subreddit** - Click popular subreddits in the sidebar to filter
- **Detailed Post View** - Modal with full post content, images, and comments
- **Markdown Rendering** - Comments and self-posts rendered from Markdown
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Loading Skeletons** - Shimmer animations during data fetching
- **Error Recovery** - Error states with retry buttons
- **Rate Limit Handling** - Built-in throttling to respect Reddit's 10 req/min limit
- **Keyboard Accessible** - Navigate posts with Tab and Enter keys
- **Smooth Animations** - Fade-in, slide-up transitions throughout the UI

## Project Structure

```
src/
  api/
    reddit.js          # Reddit JSON API with rate limiting
  components/
    Header/            # App header with logo
    SearchBar/         # Search input with clear button
    Sidebar/           # Subreddit navigation list
    PostList/          # Post feed with loading/error/empty states
    PostCard/          # Individual post card with votes and meta
    PostDetail/        # Full post modal with comments
  store/
    store.js           # Redux store configuration
    slices/
      postsSlice.js    # Posts state, search, and subreddit filtering
      subredditsSlice.js  # Popular subreddits list
      commentsSlice.js    # Post comments
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Future Work

- User authentication via Reddit OAuth for upvoting and commenting
- Infinite scroll / pagination for loading more posts
- Dark mode toggle
- Save/bookmark posts locally
- Nested/threaded comment display
- Sort posts by hot, new, top, rising
- Subreddit search in the sidebar
- Progressive Web App (offline support)
- CI/CD pipeline for automatic deployments
