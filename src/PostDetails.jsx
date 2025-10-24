import { useParams } from "react-router-dom"

export function PostDetails() {
    const {postId} = useParams()

    /*
    const {postData, isLoading, error} = usePostDetails(postId)
    */
    return (
        <h1>
            Postitus {postId}
        </h1>
    )
}