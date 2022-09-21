import { Box } from '@chakra-ui/react'
import axios from 'axios'
import { Layout } from 'components/Layout'
import PostCard from 'components/PostCard'
import { BASEURL } from 'helpers'
import { useRouter } from 'next/router'
import { Custom404 } from 'pages/404'
import useSWR from 'swr'

export default function Post() {
  const router = useRouter()
  const { id } = router.query
  const { data, error, mutate } = useSWR(id, fetcher)
  return (
    <Layout title={data?data.book.title:''}>
      {data && (
        <PostCard short={false} {...data} hideUser={false} mutate={mutate} />
      )}
      {error && <Custom404 />}
    </Layout>
  )
}

const fetcher = async (id: string) => {
  const { data } = await axios.get(`${BASEURL}/entries/${id}`, {
    withCredentials: true,
  })
  return data
}
