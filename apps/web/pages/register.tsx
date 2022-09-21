import { Box, Button, FormControl, FormLabel } from '@chakra-ui/react'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { Layout, InputField } from 'components'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { toErrorMap } from 'helpers/toErrorMap'
import { userService } from 'services/user.service'

function Register() {
  const router = useRouter()

  const [birthDate, setBirthDate] = useState(new Date())
  async function onSubmit({
    username,
    password,
    email,
  }: {
    username: string
    password: string
    email: string
  }) {
    const data = await userService.register(
      username,
      password,
      email,
      birthDate.toISOString(),
    )
    console.log({ data })
    return data
  }
  return (
    <Layout>
      <Formik
        initialValues={{ username: '', password: '', password_confirmation: '',email: '' }}
        onSubmit={async (values, { setErrors }) => {
          if(values.password !== values.password_confirmation) {
            setErrors({ password_confirmation: 'A megadott jelszavak nem egyeznek' })
            return
          }

          try {
            const response = await onSubmit(values)
            if (response.errors) {
              setErrors(toErrorMap(response.errors))
            }
          } catch (e) {
            console.log('hiba történt a regisztráció közben')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="felhasználónév"
              label="felhasználónév"
            />
            <Box mt={4} />
            <InputField
              name="email"
              placeholder="email"
              label="email"
              type="email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="jelszó"
                placeholder="jelszó"
                type="password"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="password_confirmation"
                label="jelszó megerősítése"
                placeholder="jelszó megerősítése"
                type="password"
              />
            </Box>
            <FormControl>
              <FormLabel htmlFor="birthday" mt={4}>
                születési idő
              </FormLabel>
              <SingleDatepicker
                name="birthday"
                date={birthDate}
                onDateChange={setBirthDate}
              />
            </FormControl>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              regisztráció
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default Register
