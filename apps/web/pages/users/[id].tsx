import axios from 'axios'
import { Layout } from 'components/Layout'
import UserProfile from 'components/user/profile'
import { BASEURL } from 'helpers'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { UserProps } from 'types'
export default function User({
  props,
}: {
  props: UserProps
}): InferGetServerSidePropsType<typeof getServerSideProps> {
  return (
    <Layout title={props.username}>
      <UserProfile {...props} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const result = await axios.get(`${BASEURL}/users/${params!.id}`)
  const data: UserProps = result.data
  return {
    props: {
      props: data,
    },
  }
}
