import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { usePostsStore } from './store/postsStore'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from "@contentful/rich-text-types";

export function PostDetails() {
    const {postId} = useParams()
    const postData = usePostsStore(s => s.postById[postId])
    const isLoading = usePostsStore(s => s.postLoadingById[postId])
    const error = usePostsStore(s => s.postErrorById[postId])
    const fetchPostById = usePostsStore(s => s.fetchPostById)

    useEffect(() => {
        if (!postData && postId) {
            fetchPostById(postId)
        }
    }, [postId])
    
    // Create a map of asset IDs to asset data from links
    const getAssetMap = (links) => {
        if (!links?.assets?.block) return {}
        const assetMap = {}
        links.assets.block.forEach(asset => {
            assetMap[asset.sys.id] = asset
        })
        return assetMap
    }

    const renderOption = {
        renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
                const assetMap = getAssetMap(postData?.links)
                const assetId = node.data.target.sys.id
                const asset = assetMap[assetId]
                
                if (!asset) {
                    console.warn('Asset not found:', assetId)
                    return null
                }

                return (
                    <img
                        src={asset.url}
                        width={asset.width}
                        height={asset.height}
                        alt={asset.fileName || 'Embedded image'}
                    />
                )
            }
        }
    }
    if (isLoading) {
        return (
            <h3>Loading ...</h3>
        )
    }

    if (error) {
        return (
            <h3>{error}</h3>
        )
    }

    if (!postData || typeof postData !== 'object') {
        return null
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