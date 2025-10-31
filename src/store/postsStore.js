import { create } from 'zustand'
import { getPostsList, getPostDetails } from '../utils'

export const usePostsStore = create((set, get) => ({
  posts: [],
  postsLoading: false,
  postsError: '',

  postById: {},
  postLoadingById: {},
  postErrorById: {},

  fetchPosts: async () => {
    set({ postsLoading: true, postsError: '' })
    try {
      const items = await getPostsList()
      set({ posts: items })
    } catch (e) {
      set({ postsError: 'Viga anmdete lugemisel: ' + (e?.message || 'unknown error') })
    } finally {
      set({ postsLoading: false })
    }
  },

  fetchPostById: async (id) => {
    set(state => ({
      postLoadingById: { ...state.postLoadingById, [id]: true },
      postErrorById: { ...state.postErrorById, [id]: '' },
    }))
    try {
      const details = await getPostDetails(id)
      set(state => ({
        postById: { ...state.postById, [id]: details },
      }))
    } catch (e) {
      set(state => ({
        postErrorById: { ...state.postErrorById, [id]: 'Ei õnnestunud lugeda postitust. Proovi uuesti.' },
      }))
    } finally {
      set(state => ({
        postLoadingById: { ...state.postLoadingById, [id]: false },
      }))
    }
  },

  clearErrors: () => set({ postsError: '', postErrorById: {} }),
}))


