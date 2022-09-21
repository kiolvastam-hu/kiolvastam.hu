import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  useDisclosure,
} from '@chakra-ui/react'
import axios from 'axios'
import { InputField } from 'components/InputField'
import { Form, Formik } from 'formik'
import { toErrorMap } from 'helpers/toErrorMap'
import React, { useRef, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { userService } from 'services'
function ChangePassword() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Toaster position="bottom-center" />

      <Button onClick={onOpen} id="btn-chg-pw">Jelszó megváltoztatása</Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Jelszó megváltoztatása
            </AlertDialogHeader>

            <Formik
              initialValues={{ oldPassword: '', newPassword: '' }}
              onSubmit={async (values, { setErrors }) => {
                const { data: response, status } =
                  await userService.changePassword(
                    values.oldPassword,
                    values.newPassword,
                  )
                if (status === 200) {
                  onClose()
                  toast.success('Beállítások frissítve!')
                }
                if (response.errors) {
                  setErrors(toErrorMap(response.errors))
                }
              }}
            >
              {({ handleSubmit, handleChange, values }) => (
                <Form>
                  <AlertDialogBody>
                    <InputField
                      name="oldPassword"
                      label="Régi jelszó"
                      type="password"
                      value={values.oldPassword}
                      onChange={handleChange}
                    />
                    <InputField
                      name="newPassword"
                      label="Új jelszó"
                      type="password"
                      value={values.newPassword}
                      onChange={handleChange}
                    />
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Mégse
                    </Button>
                    <Button type="submit" isLoading={isLoading} ml={3}>
                      Jelszó megváltoztatása
                    </Button>
                  </AlertDialogFooter>
                </Form>
              )}
            </Formik>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default ChangePassword
