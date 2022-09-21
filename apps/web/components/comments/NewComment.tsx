import {
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  Image,
} from '@chakra-ui/react'
import { profilePicURL } from 'helpers/profile'
import React, { useState } from 'react'
import { createComment } from 'services/entry.service'
import { userService } from 'services/user.service'
import { PostCardProps, PostProps } from 'types'
export function NewComment(props: PostProps & PostCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(props.comments)
  const me = userService.userValue

  return (
    <InputGroup>
      <InputLeftElement>
        <Image
          src={profilePicURL(me.username)}
          alt="avatar"
          w="25px"
          h="25px"
        />
      </InputLeftElement>
      <Input
        placeholder="Hozzászólás.."
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          size="sm"
          mr={2}
          onClick={async () => {
            if (comment.length > 0) {
              setIsSubmitting(true)

              const data = await createComment(props.id, comment)
              setComments(data.comments)

              // cleanup
              setComment('')
              setIsSubmitting(false)
              props.mutate()
            }
          }}
          isLoading={isSubmitting}
        >
          Küldés
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}
