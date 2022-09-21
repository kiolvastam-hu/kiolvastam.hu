import { EditIcon } from '@chakra-ui/icons'
import { Heading, Textarea, Button, Box, IconButton } from '@chakra-ui/react'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { updateEntry, userService } from 'services'
import { PostCardProps, PostCardTextProps, PostProps } from 'types'

function PostCardSummary(props: PostProps & PostCardProps & PostCardTextProps) {
  const [summary, setSummary] = useState(props.summary)
  //destructure postcardtextprops
  const {
    isEditing,
    editingField,
    setIsEditSaving,
    isEditSaving,
    setIsEditing,
    setEditingField,
  } = props
  const me = userService.userValue
  return (
    <details open>
      <Heading size="md" mt={3} as="summary">
        Összefoglalás
      </Heading>
      {isEditing && editingField === 'summary' ? (
        <>
          <Textarea
            defaultValue={summary}
            onChange={e => setSummary(e.target.value)}
            rows={10}
          />

          <Button
            onClick={async () => {
              setIsEditSaving(true)
              await updateEntry(props.id, { summary })
              props.mutate()
              setIsEditSaving(false)
              setIsEditing(false)
              setEditingField('')
            }}
            isLoading={isEditSaving}
          >
            Mentés
          </Button>
        </>
      ) : (
        <>
          <Box mt={2} color="gray.600">
            <ReactMarkdown>
              {!props.short
                ? props.summary
                : props.summary.substring(0, Math.max(100,props.summary.indexOf(' ',100))) +
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
                setEditingField('summary')
              }}
            />
          )}
        </>
      )}
    </details>
  )
}

export default PostCardSummary
