import { useParams } from "react-router-dom"
import { usePostDetails} from './utils.js'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from "@contentful/rich-text-types";

export function PostDetails() {
    const renderOption = {
        renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
                console.log('rich image', node)
            return (<img
                src={`https:${node.data.target.fields.file.url}`}
                height={node.data.target.fields.file.details.image.height}
                width={node.data.target.fields.file.details.image.width}
                alt="??"
            />)
            }
        }
    }

    const {postId} = useParams()
    const {postData, isLoading, error} = usePostDetails(postId)
    if (isLoading) {
        return (
            <h3>Loading ...</h3>
        )
    }

    return (
        <>
            <h1>
                {postData.title}
            </h1>
            <h4>
                {postData.authorName} ({postData.authorEmail})
            </h4>
            <div>
            {documentToReactComponents(postData.content, renderOption)}
            </div>
        </>
    )
}