import { useEffect } from "react"
import { getPostsList, usePostsList } from "./utils.js"
import { PostListElement } from "./PostListElement.jsx"

export function Home() {
    const {postsListData, isLoadingPosts, postsError} = usePostsList()

    if (isLoadingPosts) {
        return (
            <h3>Loading posts list ... </h3>
        )
    }
    
    return (
        <>
            <h1>Esileht</h1>
            <div className="row">
            {
                postsListData.map((el, indeks) => {
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