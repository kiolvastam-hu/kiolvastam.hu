import { Box, Button } from '@chakra-ui/react'
import { InputField, Layout } from 'components'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { userService } from '../services/user.service'

function Login() {
  const router = useRouter()
  async function onSubmit({
    username,
    password,
  }: {
    username: string
    password: string
  }) {
    return await userService.login(username, password)
  }
  const [error, setError] = useState(false)
  const [errorText, setErrorText] = useState('')
  return (
    <Layout>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          try {
            const response = await onSubmit(values)
            if (typeof router.query.returnUrl === "string") {
              router.push(router.query.returnUrl);
            } else {
              router.push("/feed");
            }
          } catch (e: any) {
            setError(true)
            setErrorText(e.message)
            console.log(errorText)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="felhasználónév..."
              label="felhasználónév"
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="jelszó"
                placeholder="jelszó..."
                type="password"
              />
            </Box>
            {error && <Box color={'red'}>{errorText}</Box>}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              bejelentkezés
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default Login
