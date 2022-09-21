import {
	AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useRef, useState } from 'react'

function DeleteUser({ endpoint }: { endpoint: string }) {
  const onDeleteUser = async () => {
    setIsLoading(true)
    const result = await axios.delete(endpoint, { withCredentials: true })
    console.log(result)
    setIsLoading(false)
    onClose()
    window.location.href = '/'
  }
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Button colorScheme={'red'} onClick={onOpen} id="btn-del-pro">
        Profil törlése
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Profil törlése
            </AlertDialogHeader>

            <AlertDialogBody>
              Biztosan törölni szeretnéd ezt a profilodat? Ezzel az összes hozzászólásod és bejegyzésed törlődik. A profilodat nem lehet visszaállítani.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Mégse
              </Button>
              <Button
                colorScheme="red"
                onClick={onDeleteUser}
                isLoading={isLoading}
                ml={3}
              >
                Törlés
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default DeleteUser
