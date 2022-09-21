import { StarIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { likeEntry } from 'services/entry.service'

type LikeButtonProps = {
  isLiked: boolean
  likeCount: number
  postId: string
}

export default function LikeButton(props: LikeButtonProps) {
  const { isLiked: initLiked, likeCount: initLikeCount, postId } = props
  const [isLiking, setIsLiking] = useState(false)
  const [isLiked, setIsLiked] = useState(initLiked)
  const [likeCount, setLikeCount] = useState(initLikeCount)
  function handleLike() {
    setIsLiking(true)
    likeEntry(postId)
      .then(data => {
        setIsLiked(data.liked)
        setLikeCount(data.likeCount)
      })
      .finally(() => {
        setIsLiking(false)
      })
  }
  return (
    <Button
      onClick={handleLike}
      disabled={isLiking}
      // isLoading={isLiking}
      colorScheme={isLiked ? 'blue' : 'gray'}
      leftIcon={<StarIcon />}
      id="like-button"
    >
      {likeCount}
    </Button>
  )
}
