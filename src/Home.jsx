import { useEffect } from "react"
import { getPostsList } from "./utils.js"

export function Home() {
    useEffect(() => {
        getPostsList()
    }, [])
    return (
        <h1>Esileht</h1>
    )
}