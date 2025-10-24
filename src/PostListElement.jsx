import { Link } from "react-router-dom"
export function PostListElement({post}) {
    return (
        <>
            <h3>
                {post.title}
            </h3>
            <p>
               <strong>
                    {post.postAuthor.name}
                </strong> {post.excerpt}
            </p>
            <div className="postListImage">
                <img src={post.postPic.url}/>
            </div>
            <Link to={`/post/${post.sys.id}`}  >Loe edasi</Link>

        </>
    )
}