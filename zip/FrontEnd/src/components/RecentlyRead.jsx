"use client"

import { Card, CardContent } from "./ui/card"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye } from "lucide-react"
import { useState, useEffect } from "react"

export default function RecentlyRead({ books, loading }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-6">Recently Read</h2>
        <p className="text-muted-foreground">Loading your reading history...</p>
      </section>
    )
  }

  if (books.length === 0) {
    return (
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-6">Recently Read</h2>
        <p className="text-muted-foreground">You haven't read any books yet.</p>
      </section>
    )
  }

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6">Recently Read</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <BookCard key={book.book_id} book={book} index={index} />
        ))}
      </div>
    </section>
  )
}

function BookCard({ book, index }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const navigate = useNavigate()

  // Destructure book_details from the book object
  const { book_details, last_read_at } = book
  const {
    title,
    author_name,
    views,
    cover,
    progress,
    file_url,
    audio_url,
    is_public,
    is_approved,
    uploaded_at,
    uploaded_by_role,
    categories,
    cover_url,
  } = book_details

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/bookmarks/book/${book.book_id}/user`, {
          headers: { Authorization: `${localStorage.getItem("token")}` },
          method: "GET",
        })

        if (response.ok) {
          const data = await response.json()
          setIsBookmarked(data.is_bookmarked)
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error)
      }
    }

    // checkBookmarkStatus()
  }, [book])

  const handleBookmark = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const method = isBookmarked ? "DELETE" : "POST"
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/bookmarks/book/${book.book_id}/user`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Bookmark update failed")
      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error("Error updating bookmark:", error)
    }
  }

  const shareBook = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const url = `${window.location.origin}/book/${book.book_id}`
    navigator.clipboard.writeText(url)
    alert("Link copied to clipboard!")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Card className="cursor-pointer relative rounded-xl" onClick={() => navigate(`/book/${book.book_id}`)}>
        {/* <div className="absolute top-2 right-2 z-10 flex space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/30 hover:bg-black/50 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={handleBookmark}>
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
                    <span>Remove Bookmark</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 mr-2" />
                    <span>Add to Bookmarks</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareBook}>
                <Share className="h-4 w-4 mr-2" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Heart className="h-4 w-4 mr-2" />
                <span>Add to Favorites</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}

        <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl">
          <img
            src={
              "http://127.0.0.1:5000/books/" + cover_url ||
              "https://marketplace.canva.com/EAFjYY88pEE/1/0/1003w/canva-white%2C-green-and-yellow-minimalist-business-book-cover-cjr8n1BH2lY.jpg" ||
              "/placeholder.svg"
            }
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {progress && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-1 line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-1 line-clamp-1">{author_name || "Unknown Author"}</p>
          <div className="flex items-center text-muted-foreground mb-2">
            <Eye className="h-3 w-3 mr-1" />
            <span className="text-xs">{views || 0} views</span>
          </div>
          {last_read_at && (
            <p className="text-xs text-muted-foreground">Last read: {new Date(last_read_at).toLocaleDateString()}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

