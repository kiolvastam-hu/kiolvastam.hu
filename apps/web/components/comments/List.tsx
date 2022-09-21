import React from 'react'
import { KeyedMutator } from 'swr'
import { PostProps } from 'types/PostProps'
import { Comment } from 'components/comments'

export function CommentList({
  entry,
  mutate,
}: {
  entry: PostProps
  mutate: KeyedMutator<any>
}) {
  const { comments } = entry
  return (
    <div>
      {comments.map(comment => (
        <Comment
          key={comment.id}
          comment={comment}
          entry={entry}
          mutate={mutate}
        />
      ))}
    </div>
  )
}
