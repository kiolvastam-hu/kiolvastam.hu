import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Switch,
} from '@chakra-ui/react'
import axios from 'axios'
import { Layout } from 'components'
import ChangeEmail from 'components/settings/changeemail'
import ChangePassword from 'components/settings/changepassword'
import DeleteUser from 'components/settings/deleteuser'
import { BASEURL } from 'helpers'
import React from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { changeProperty } from 'services'
import useSWR, { Fetcher } from 'swr'

export default function Settings() {
  const fetcher: Fetcher<{
    emailPrivate: boolean
    birthdayPrivate: boolean
    email: string
  }> = (url: string) =>
    axios.get(url, { withCredentials: true }).then(r => r.data)
  const endpoint = `${BASEURL}/users/me/settings`
  const { data, error, mutate } = useSWR(endpoint, fetcher)

  const updateSettings = async (values: {
    emailPrivate?: boolean
    birthdayPrivate?: boolean
  }) => {
    const { data } = await changeProperty(values)
    mutate(data)
    toast.success('Beállítások frissítve!')
  }

  return (
    <Layout>
      <Toaster position="bottom-center" />
      <Heading>Beállítások</Heading>
      {/* map each key in data and display it*/}
      {data && (
        <>
          <Stack spacing="3">
            <FormControl as={SimpleGrid} columns={2}>
              <FormLabel htmlFor="email-private" mb="0">
                e-mail cím elrejtése a profilomnál
              </FormLabel>
              <Switch
                id="email-private"
                isChecked={data.emailPrivate}
                onChange={() =>
                  updateSettings({ emailPrivate: !data.emailPrivate })
                }
              />
              <FormLabel htmlFor="bd-private" mb="0">
                születési dátum elrejtése a profilomnál
              </FormLabel>
              <Switch
                id="bd-private"
                isChecked={data.birthdayPrivate}
                onChange={() =>
                  updateSettings({ birthdayPrivate: !data.birthdayPrivate })
                }
              />
            </FormControl>
          </Stack>
          <HStack spacing={4} align='flex-start'>
            <Button as="a" href={`${BASEURL}/users/me.json`} id="btn-export">
              Exportálás
            </Button>
            <ChangePassword />
            <ChangeEmail email={data!.email} />
            <DeleteUser endpoint={endpoint} />
          </HStack>
        </>
      )}
      {error && <pre>{error.message}</pre>}
    </Layout>
  )
}
