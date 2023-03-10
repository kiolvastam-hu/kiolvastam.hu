import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  IconButton,
  Switch,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import nProgress from 'nprogress'
import React, { useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { deleteEntry, updateEntry } from 'services/entry.service'
import { KeyedMutator } from 'swr'

type AdminProps = {
  initPrivate: boolean
  initShowComments: boolean
  entryId: string
  mutate: KeyedMutator<any>
}

export default function PostAdmin({
  initPrivate,
  initShowComments,
  entryId,
  mutate,
}: AdminProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const router = useRouter()
  const [isPrivate, setIsPrivate] = useState(initPrivate)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const onDeleteEntry = async () => {
    setIsDeleting(true)
    const result = await deleteEntry(entryId)
    console.log(result)
    setIsDeleting(false)
    onClose()
    router.push('/feed')
  }

  const onChangePrivate = async () => {
    nProgress.start()
    setIsLoading(true)

    setIsPrivate(!isPrivate)
    await updateEntry(entryId, { private: !isPrivate })

    mutate()
    nProgress.done()
    setIsLoading(false)
  }

  // show comments?
  const [showComments, setShowComments] = useState(initShowComments)
  const onChangeCommentsHidden = async () => {
    nProgress.start()
    setIsLoading(true)

    setShowComments(!showComments)
    await updateEntry(entryId, { showComments: !showComments })

    mutate()
    nProgress.done()
    setIsLoading(false)
  }
  const [isLargerThan1280] = useMediaQuery('(min-width: 1280px)')
  return (
    <Flex>
      <Toaster position="bottom-center" />
      <Center ml={3}>
        <Box>
          <Switch
            isChecked={!isPrivate}
            onChange={() =>
              toast.promise(
                onChangePrivate(),
                {
                  loading: 'Bet??lt??s...',
                  success: 'Sikeres m??dos??t??s',
                  error: 'Hiba t??rt??nt...',
                },
                {
                  icon: '????',
                },
              )
            }
            isDisabled={isLoading}
            mr={3}
          />
          {isPrivate ? 'Priv??t' : 'Publikus'}
          
          <Switch
            isChecked={showComments}
            onChange={onChangeCommentsHidden}
            isDisabled={isLoading}
            mr={3}
            ml={2}
          />
          {showComments ? 'kommentek megjelen??t??se' : 'kommentek elrejt??se'}
        </Box>
      </Center>
      <IconButton
        ml={1}
        colorScheme="red"
        aria-label="T??rl??s"
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
              Bejegyz??s t??rl??se
            </AlertDialogHeader>

            <AlertDialogBody>
              Biztosan t??r??lni szeretn??d ezt a bejegyz??st?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                M??gse
              </Button>
              <Button
                colorScheme="red"
                onClick={onDeleteEntry}
                isLoading={isDeleting}
                ml={3}
              >
                T??rl??s
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  )
}
