<!-- 49964145-af47-4d6e-8429-374afdd39bf2 ff8af135-0efb-4758-8290-70ec3748cfaf -->
# Refactor to Zustand Global State (No Persistence)

## Goals

- Centralize posts list and post details state in a single Zustand store.
- Replace `usePostsList` and `usePostDetails` hooks with direct store selectors in components.
- Keep current UI/UX intact; no persistence.

## Files to Change / Add

- Add: `src/store/postsStore.js` — Zustand store (state, actions, async thunks).
- Update: `src/Home.jsx` — read from store with selectors; trigger fetch on mount.
- Update: `src/PostDetails.jsx` — read from store with selectors; trigger fetch on param change.
- Update: `src/utils.js` — keep low-level `_fetch` + query builders, remove React state hooks.

## Store Shape

```ts
// src/store/postsStore.js
interface PostsState {
  posts: Array<Post>;
  postsLoading: boolean;
  postsError: string;

  postById: Record<string, PostDetails>; // normalized cache
  postLoadingById: Record<string, boolean>;
  postErrorById: Record<string, string>;

  fetchPosts: () => Promise<void>;
  fetchPostById: (id: string) => Promise<void>;
  clearErrors: () => void;
}
```

## Data Flow

- `utils.js` exposes only fetch helpers: `_fetch`, `getPostsList`, `getPostDetails` (no React hooks).
- `postsStore` calls those helpers in `fetchPosts`/`fetchPostById` and updates state.
- Components use `usePostsStore` selectors: `posts`, `postsLoading`, `postsError`, and `postById[postId]`, etc.

## Component Changes

- `Home.jsx`
  - Replace `usePostsList()` with:
    - `const posts = usePostsStore(s => s.posts)`
    - `const loading = usePostsStore(s => s.postsLoading)`
    - `const error = usePostsStore(s => s.postsError)`
    - `const fetchPosts = usePostsStore(s => s.fetchPosts)`
  - `useEffect(() => { if (!posts.length) fetchPosts(); }, [])`

- `PostDetails.jsx`
  - Replace `usePostDetails(postId)` with:
    - `const post = usePostsStore(s => s.postById[postId])`
    - `const loading = usePostsStore(s => s.postLoadingById[postId])`
    - `const error = usePostsStore(s => s.postErrorById[postId])`
    - `const fetchPostById = usePostsStore(s => s.fetchPostById)`
  - `useEffect(() => { if (!post) fetchPostById(postId); }, [postId])`

## Error/Loading UX

- Keep current render branches; swap variables to store-backed ones.
- Optionally expose a `clearErrors` action and call it when navigating.

## Minimal Code Snippets

- Store creation:
```js
import { create } from 'zustand'
import { getPostsList, getPostDetails } from '../utils'

export const usePostsStore = create((set, get) => ({
  posts: [], postsLoading: false, postsError: '',
  postById: {}, postLoadingById: {}, postErrorById: {},

  fetchPosts: async () => {
    set({ postsLoading: true, postsError: '' })
    try { const items = await getPostsList(); set({ posts: items }) }
    catch (e) { set({ postsError: 'Viga anmdete lugemisel: ' + e.message }) }
    finally { set({ postsLoading: false }) }
  },

  fetchPostById: async (id) => {
    set(state => ({
      postLoadingById: { ...state.postLoadingById, [id]: true },
      postErrorById: { ...state.postErrorById, [id]: '' },
    }))
    try { const details = await getPostDetails(id)
      set(state => ({ postById: { ...state.postById, [id]: details } }))
    } catch (e) {
      set(state => ({ postErrorById: { ...state.postErrorById, [id]: 'Ei õnnestunud lugeda postitust. Proovi uuesti.' } }))
    } finally {
      set(state => ({ postLoadingById: { ...state.postLoadingById, [id]: false } }))
    }
  },

  clearErrors: () => set({ postsError: '', postErrorById: {} }),
}))
```


## Migration Steps

1. Install Zustand: `npm i zustand`.
2. Create `src/store/postsStore.js` with the described state/actions.
3. Refactor `src/utils.js` to export only fetch helpers; remove React-specific hooks.
4. Update `src/Home.jsx` and `src/PostDetails.jsx` to use store selectors and effects.
5. Remove any now-unused imports and code.
6. Manual test:

   - Home loads list, shows loading state, errors handled.
   - Post details route loads by ID, shows images via existing renderer.

7. Optional: normalize authors/media later if needed.

### To-dos

- [ ] Add Zustand dependency to project
- [ ] Create posts store in src/store/postsStore.js
- [ ] Strip React hooks from utils.js; keep fetch helpers
- [ ] Refactor Home.jsx to read from store and fetch on mount
- [ ] Refactor PostDetails.jsx to read details from store and fetch on id change
- [ ] Remove unused imports and dead code after refactor
- [ ] Manually test list and details flows, loading and error states


