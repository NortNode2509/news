// React imports removed; this module only provides fetch helpers

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

// React hooks removed; data fetching handled via Zustand store

export async function getPostDetails(postId) {
  const detailsQuery = `
    query {
      post(id: "${postId}") {
        title
        postAuthor {
          name
          email
        }
        postPic {url}
        content {
          json
          links {
            assets {
              block {
                sys {
                  id
                }
                url
                fileName
                contentType
                width
                height
              }
            }
          }
        }
        }
    }
    `
  const detailsData = await _fetch(detailsQuery, 1)
  return {
    title: detailsData.data.post.title,
    authorName: detailsData.data.post.postAuthor?.name || 'unknown',
    authorEmail: detailsData.data.post.postAuthor.email,
    content: detailsData.data.post.content.json,
    links: detailsData.data.post.content.links
  }
}

// React hooks removed; details fetching handled via Zustand store


