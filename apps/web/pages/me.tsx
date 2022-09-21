import axios from 'axios'
import { Layout } from 'components/Layout'
import UserProfile from 'components/user/profile'
import { BASEURL } from 'helpers'
import React from 'react'
import useSWR, { Fetcher } from 'swr'
import { UserProps } from 'types'
import { Custom404 } from './404'

export default function MePage() {
  const fetcher: Fetcher<UserProps> = (url: string) =>
    axios.get(url, { withCredentials: true }).then(r => r.data)
  const endpoint = `${BASEURL}/users/me`

  const { data, error, mutate } = useSWR(endpoint, fetcher)

  return (
    <Layout>
      {data && <UserProfile {...data} />}
      {error && <Custom404 />}
    </Layout>
  )
}
