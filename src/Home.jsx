import { useEffect } from "react"
import { PostListElement } from "./PostListElement.jsx"
import { usePostsStore } from "./store/postsStore"

export function Home() {
    const posts = usePostsStore(s => s.posts)
    const isLoadingPosts = usePostsStore(s => s.postsLoading)
    const postsError = usePostsStore(s => s.postsError)
    const fetchPosts = usePostsStore(s => s.fetchPosts)

    useEffect(() => {
        if (!posts || posts.length === 0) {
            fetchPosts()
        }
    }, [])

    if (isLoadingPosts) {
        return (
            <h3>Loading posts list ... </h3>
        )
    }
    if (postsError) {
        return (
            <h3>{postsError}</h3>
        )
    }
    
    return (
        <>
            <h1>Esileht</h1>
            <div className="row">
            {
                posts.map((el, indeks) => {
                    return (
                        <div key={indeks} className="col-md-6" >                                        
                            <PostListElement  post={el}/>
                        </div>

                    )
                })
            }
            </div>
        </>
    )
}