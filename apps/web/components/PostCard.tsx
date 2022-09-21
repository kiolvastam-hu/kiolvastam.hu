import { EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react'
import { CommentList, NewComment } from 'components/comments'
import LikeButton from 'components/LikeButton'
import PostAdmin from 'components/PostAdmin'
import {
  PostCardBookDetails,
  PostCardDate,
  PostCardTags,
  PostCardUser,
} from 'components/postcardparts'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { updateEntry } from 'services/entry.service'
import { userService } from 'services/user.service'
import { PostCardProps, PostProps } from 'types'
import PostCardOpinion from './postcardparts/opinion'
import PostCardSummary from './postcardparts/summary'

const PostCard: React.FC<PostProps & PostCardProps> = props => {
  const ReadMoreLinkColor = useColorModeValue('brand.600', 'brand.400')
  const me = userService.userValue
  const router = useRouter()

  // state related to editing
  const [isEditing, setIsEditing] = useState(false)
  const [editingField, setEditingField] = useState('')
  const [isEditSaving, setIsEditSaving] = useState(false)

  // state related to editable fields
  const [summary, setSummary] = useState(props.summary)
  const [opinion, setOpinion] = useState(props.opinion)

  // state related to styles
  const linkColor = useColorModeValue('gray.700', 'gray.200')
  const boxBg = useColorModeValue('gray.50', 'gray.700')
  const privateBoxBg = useColorModeValue('gray.200', 'gray.500')
  return (
    <Box minW="100%">
      <Flex
        // bg={useColorModeValue('#F9FAFB', 'gray.600')}
        p={3}
        w="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          mx="auto"
          px={8}
          py={4}
          rounded="lg"
          shadow="lg"
          bg={props.private ? privateBoxBg : boxBg}
          maxW={props.short ? '1xl' : ''}
          minW={props.short ? '100%' : '100%'}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <PostCardDate {...props} />
            <PostCardTags {...props} hide={props.hideTags} />
          </Flex>
          <Box mt={2}>
            <PostCardBookDetails {...props} hide={props.hideBook} />
            {(props.opinion || (props.user.id == me.id&&!props.short)) && (
              <PostCardOpinion
                {...props}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editingField={editingField}
                setEditingField={setEditingField}
                isEditSaving={isEditSaving}
                setIsEditSaving={setIsEditSaving}
              />
            )}

            {(props.summary || (props.user.id == me.id&&!props.short)) && (
              <PostCardSummary
                {...props}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editingField={editingField}
                setEditingField={setEditingField}
                isEditSaving={isEditSaving}
                setIsEditSaving={setIsEditSaving}
              />
            )}
          </Box>
          <Flex justifyContent="space-between" alignItems="center" mt={4}>
            {props.short ? (
              <NextLink href={`/post/${props.id}`} passHref>
                <Link
                  color={ReadMoreLinkColor}
                  _hover={{ textDecor: 'underline' }}
                  fontWeight="700"
                >
                  teljes bejegyzés
                </Link>
              </NextLink>
            ) : (
              <Flex>
                <LikeButton
                  postId={props.id}
                  isLiked={props.liked}
                  likeCount={props.likeCount}
                />
                {me && me.id === props.user.id && (
                  <PostAdmin
                    initPrivate={props.private}
                    initShowComments={props.showComments}
                    entryId={props.id}
                    mutate={props.mutate}
                  />
                )}
              </Flex>
            )}
            <PostCardUser {...props} />
          </Flex>
        </Box>
      </Flex>

      {!props.short && props.showComments && (
        <Box
          mx="auto"
          px={8}
          py={4}
          rounded="lg"
          shadow="lg"
          bg={props.private ? privateBoxBg : boxBg}
          maxW={props.short ? '1xl' : ''}
          // minW="lg"
          mb={300}
        >
          <NewComment {...props} />
          {/* list all comments */}
          <CommentList entry={props} mutate={props.mutate} />
        </Box>
      )}
    </Box>
  )
}

export default PostCard
