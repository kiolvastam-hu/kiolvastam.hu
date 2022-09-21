import { Heading } from '@chakra-ui/react'
import axios from 'axios'
import { BASEURL } from 'helpers'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { PostProps } from 'types/PostProps'
import { Layout } from 'components/Layout'
import PostCard from 'components/PostCard'
export default function Post({
  props,
  tag,
}: {
  props: PostProps[]
  tag: string
}): InferGetServerSidePropsType<typeof getServerSideProps> {
  return (
    <Layout>
      <Heading>
        {tag} címkével ellátott bejegyzések - {props.length} db
      </Heading>
      {props.length > 0 &&
        props.map(post => (
          <PostCard key={post.id} short {...post} hideUser={false} />
        ))}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const paramString = encodeURI(params!.id as string)
  const result = await axios.get(`${BASEURL}/tags/${paramString}`)
  const data: PostProps = result.data
  return {
    props: {
      props: data,
      tag: params!.id as string,
    },
  }
}
