import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button, useDisclosure
} from '@chakra-ui/react'
import { InputField } from 'components/InputField'
import { Form, Formik } from 'formik'
import { toErrorMap } from 'helpers/toErrorMap'
import React, { useRef, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { changeProperty } from 'services'
function ChangeEmail({email}:{email:string|undefined}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Toaster position="bottom-center" />

      <Button onClick={onOpen} id="btn-chg-email">E-mail cím megváltoztatása</Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              E-mail cím megváltoztatása
            </AlertDialogHeader>

            <Formik
              initialValues={{ email}}
              onSubmit={async (values, { setErrors }) => {
                const { data: response, status } =
                  await changeProperty({email:values.email})
                if (status === 200) {
                  onClose()
                  toast.success('Beállítások frissítve!')
                }
                if (response.errors) {
                  setErrors(toErrorMap(response.errors))
                }
              }}
            >
              {({ handleChange, values }) => (
                <Form>
                  <AlertDialogBody>
                    <InputField
                      name="email"
                      label="Új e-mail"
                      value={values.email}
											type="email"
                      onChange={handleChange}
                    />
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Mégse
                    </Button>
                    <Button type="submit" isLoading={isLoading} ml={3}>
                      E-mail cím megváltoztatása
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

export default ChangeEmail
