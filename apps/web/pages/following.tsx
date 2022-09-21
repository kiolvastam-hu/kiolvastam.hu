import { Box, Center, Heading, Spinner, Text } from '@chakra-ui/react'
import axios from 'axios'
import { Layout } from 'components'
import PostCard from 'components/PostCard'
import { BASEURL } from 'helpers'
import { GetServerSideProps } from 'next'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PostProps } from 'types'
import NextImage from 'next/image'
function Following() {
  const [posts, setPosts] = useState<PostProps[]>([])
  const [hasMore, setHasMore] = useState(true)

  const getMorePost = async () => {
    const { data } = await axios.get(
      `${BASEURL}/entries/following?offset=${posts.length}`,
      { withCredentials: true },
    )
    const { entries: newPosts, hasMore } = data
    setPosts(posts => [...posts, ...newPosts])
    setHasMore(hasMore)
  }

  // run getMorePost() when the component is mounted
  useEffect(() => {
    getMorePost()
  })

  return (
    <Layout title="Követett">
      <Heading size="md">
        Az általad követetett felhasználók bejegyzései
      </Heading>
      {posts.length === 0 ? (
       <Box>
       <Text>Az általad követett felhasználók még nem készítettek bejegyzést...</Text>
       <Center>
         <NextImage
           src="/images/floating.svg"
           alt="book"
           width="320px"
           height="246px"
         />
       </Center>
     </Box>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={getMorePost}
          hasMore={hasMore}
          loader={<Spinner />}
          endMessage={
            <Text textAlign="center">- a bejegyzések végére értél -</Text>
          }
        >
          {posts.map(post => (
            <PostCard key={post.id} short={true} {...post} />
          ))}
        </InfiniteScroll>
      )}
    </Layout>
  )
}

export default Following
