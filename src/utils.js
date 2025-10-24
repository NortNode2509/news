import { useEffect, useState } from "react"

const SPACEID = '87q1y9nxj6pl'
const TOKEN = 'oMdYPneO2i1y0acbKR6sVdHxEZtlOYB9Dq6d_zKJQnk'

const URL = `https://graphql.contentful.com/content/v1/spaces/${SPACEID}`

async function _fetch(request, retries = 0) {
    const result = await fetch(
        URL,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({query: request})
        }
    )

    if (result.status === 408 ) {
      if (retries > 3) {
        throw new Error('timeout in 3 retires')
      }
      return _fetch(request, retries +1)
    }

    if (!result.ok) {
      throw new Error('fetching failed')
    }
    
    const data = await result.json();
    return data;
}


export async function  getPostsList() {
    const request = `
    query {
  postCollection {
    items {
      sys {id}
      title
      excerpt
      postAuthor {
        name
        email
      }
      postPic {
        url
      }
    }
  }
}
  `

  const andmed = await _fetch(request, 1)
  console.log(andmed)
  return andmed.data?.postCollection?.items || []
}

export function usePostsList() {
  const [postsListData, setPostsListData ] = useState([])
  const [isLoadingPosts, setIsLoadingPosts ] = useState(false)
  const [postsError, setPostsError ] = useState("")

  const fetchData = async () => {
    setIsLoadingPosts(true)
    let postsData = []
    try {
      postsData = await getPostsList()
      setPostsListData(() => postsData)
      setIsLoadingPosts(false)
      setPostsError("")
    } catch (e) {
      setPostsError("Viga anmdete lugemisel: " + e.message)
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [])

  return {postsListData, isLoadingPosts, postsError}
}

//todo: veel üks customHook, mis loeb ühe postituse andmed vastavalt postituse id-le
