import { DeleteIcon } from '@chakra-ui/icons'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Link,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { formatRelative } from 'date-fns'
import { hu } from 'date-fns/locale'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { KeyedMutator } from 'swr'
import { CommentProps } from 'types/CommentProps'
import { PostProps } from 'types/PostProps'
import parseCommentText from '../../helpers/comment'
import { profilePicURL } from '../../helpers/profile'
import { deleteComment } from '../../services/entry.service'
import { userService } from '../../services/user.service'
export function Comment({
  comment,
  entry,
  mutate,
}: {
  comment: CommentProps
  entry: PostProps
  mutate: KeyedMutator<any>
}) {
  const me = userService.userValue
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const onDeleteComment = async () => {
    setIsDeleting(true)
    const result = await deleteComment(entry.id, comment.id)
    console.log(result)
    setIsDeleting(false)
    mutate()
    onClose()
    toast('Komment törölve!', {
      icon: <DeleteIcon />,
    })
  }
  return (
    <Box key={comment.id} mt={4} mb={4}>
      <Toaster position="bottom-center" />
      <Flex justifyContent={'space-between'}>
        <Flex>
          <Image
            src={profilePicURL(comment.user.username)}
            alt="avatar"
            w="20px"
            h="20px"
            mr={2}
          />

          <NextLink href={`/users/${comment.user.username}`} passHref>
            <Link>
              <Text
                fontWeight={
                  comment.user.username === entry.user.username ? '700' : '500'
                }
              >
                {comment.user.username}
              </Text>
            </Link>
          </NextLink>
        </Flex>
        <Text>
          {formatRelative(new Date(comment.createdAt), new Date(), {
            locale: hu,
          })}

          {/* user with moderator/admin role, post author and comment author can delete comments */}
          {(me.role === 'moderator' ||
            me.role === 'admin' ||
            me.id === entry.user.id ||
            me.id == comment.user.id) && (
            <>
              <IconButton
                ml={1}
                size="xs"
                colorScheme="red"
                aria-label="Törlés"
                icon={<DeleteIcon />}
                onClick={onOpen}
              />
              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Hozzászólás törlése
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Biztosan törölni szeretnéd ezt a hozzászólást?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Mégse
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={onDeleteComment}
                        isLoading={isDeleting}
                        ml={3}
                      >
                        Törlés
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          )}
        </Text>
      </Flex>
      {parseCommentText(comment.text)}
    </Box>
  )
}
