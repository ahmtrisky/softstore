"use client"

import { Star } from "lucide-react"
import { memo } from "react"

interface StarRatingProps {
  rating: number
  interactive?: boolean
  onChange?: (rating: number) => void
  size?: "sm" | "md" | "lg"
}

function StarRating({ rating, interactive = false, onChange, size = "sm" }: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`
            ${sizeClasses[size]}
            ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}
            ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          `}
          onClick={(e) => {
            if (interactive && onChange) {
              e.preventDefault()
              e.stopPropagation()
              onChange(star)
            }
          }}
        />
      ))}
    </div>
  )
}

export default memo(StarRating)
