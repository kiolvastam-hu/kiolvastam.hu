import { EditIcon } from '@chakra-ui/icons'
import { Box, Button, Heading, IconButton, Textarea } from '@chakra-ui/react'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { updateEntry, userService } from 'services'
import { PostCardProps, PostCardTextProps, PostProps } from 'types'

function PostCardOpinion(props: PostProps & PostCardProps & PostCardTextProps) {
  const [opinion, setOpinion] = useState(props.opinion)
  const me = userService.userValue
  const {
    isEditing,
    editingField,
    setIsEditSaving,
    isEditSaving,
    setIsEditing,
    setEditingField,
  } = props
  return (
    <details open>
      <Heading size="md" as="summary">
        Vélemény
      </Heading>
      {isEditing && editingField === 'opinion' ? (
        <>
          <Textarea
            value={opinion}
            onChange={e => setOpinion(e.target.value)}
            rows={10}
          />
          <Button
            mt={2}
            onClick={async () => {
              setIsEditSaving(true)
              await updateEntry(props.id, { opinion })
              props.mutate()

              setIsEditSaving(false)
              setIsEditing(false)
              setEditingField('')
            }}
            isLoading={props.isEditSaving}
          >
            Mentés
          </Button>
        </>
      ) : (
        <>
          <Box mt={2} color={'gray.600'}>
            <ReactMarkdown>
              {!props.short
                ? props.opinion
                : props.opinion.substring(0, Math.max(props.opinion.indexOf(' ', 10),100)) +
                  '...'}
            </ReactMarkdown>
          </Box>
          {!props.short && me && me.id == props.user.id && (
            <IconButton
              size="sm"
              aria-label="edit"
              icon={<EditIcon />}
              onClick={() => {
                setIsEditing(true)
                setEditingField('opinion')
              }}
            />
          )}
        </>
      )}
    </details>
  )
}

export default PostCardOpinion
