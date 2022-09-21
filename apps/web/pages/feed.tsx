import axios from 'axios'
import FeedContent from 'components/feed/feedcontent'
import { BASEURL } from 'helpers/constants'
import type { InferGetServerSidePropsType } from 'next'
import { Layout } from 'components/Layout'
import styles from 'styles/Home.module.css'

const Home = ({
  entries,
  hasMore,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
        <FeedContent entries={entries} hasMore={hasMore} />
    </Layout>
  )
}

export async function getServerSideProps() {
  const {
    data: { entries, hasMore },
  } = await axios.get(BASEURL + '/entries/')
  return {
    props: {
      entries,
      hasMore,
    },
  }
}
export default Home
