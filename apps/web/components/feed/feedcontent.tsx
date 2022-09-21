import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  SimpleGrid,
  Spinner,
  Switch,
  Text,
} from '@chakra-ui/react'
import axios from 'axios'
import PostCard from 'components/PostCard'
import { BASEURL } from 'helpers'
import React, { useState } from 'react'
import { HiSortAscending, HiSortDescending } from 'react-icons/hi'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PostProps } from 'types'

function FeedContent({
  entries,
  hasMore,
}: {
  entries: PostProps[]
  hasMore: boolean
}) {
  const [sortedPosts, setSortedPosts] = useState(entries)
  const [sortOrder, setSortOrder] = useState('desc')
  const [hasMorePosts, setHasMorePosts] = useState(hasMore)
  const [showOpinion, setShowOpinion] = useState(true)
  const [showSummary, setShowSummary] = useState(true)

  const getMorePost = async () => {
    const { data } = await axios.get(
      `${BASEURL}/entries?offset=${sortedPosts.length}`,
    )
    const { entries: newPosts, hasMore } = data
    setSortedPosts(posts => [...posts, ...newPosts])
    setHasMorePosts(hasMore)
  }

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button>Szűrés</Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>szűrés / rendezés</PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>
              <Box>
                <Text>Rendezés:</Text>
                <Flex>
                  <IconButton
                    colorScheme="teal"
                    variant={sortOrder === 'asc' ? 'solid' : 'outline'}
                    aria-label="Sort by date ascending"
                    title="Dátum szerint növekvő"
                    icon={<HiSortAscending />}
                    mr={2}
                    onClick={() => {
                      setSortedPosts(
                        [...sortedPosts].sort((a, b) => {
                          return a.createdAt.localeCompare(b.createdAt)
                        }),
                      )
                      setSortOrder('asc')
                    }}
                  />
                  <IconButton
                    colorScheme="teal"
                    aria-label="Sort by date descending"
                    title="Dátum szerint csökkenő"
                    variant={sortOrder === 'desc' ? 'solid' : 'outline'}
                    icon={<HiSortDescending />}
                    onClick={() => {
                      setSortedPosts(
                        [...sortedPosts].sort((a, b) => {
                          return b.createdAt.localeCompare(a.createdAt)
                        }),
                      )
                      setSortOrder('desc')
                    }}
                  />
                </Flex>
              </Box>
              <Box as={SimpleGrid} columns="2">
                <FormLabel htmlFor="opinionCheck">vélemények</FormLabel>
                <Switch
                  id="opinionCheck"
                  isChecked={showOpinion}
                  onChange={() => {
                    setShowOpinion(!showOpinion)
                  }}
                />

                <FormLabel htmlFor="summaryCheck">összefoglalók</FormLabel>
                <Switch
                  id="summaryCheck"
                  isChecked={showSummary}
                  onChange={() => {
                    setShowSummary(!showSummary)
                  }}
                />
              </Box>
            </PopoverBody>
            <PopoverFooter>
              {showOpinion && !showSummary ? 'Csak vélemények mutatása' : ''}
              {!showOpinion && showSummary ? 'Csak összefoglalók mutatása' : ''}
              {showOpinion && showSummary ? 'Összes bejegyzés mutatása' : ''}
              {!showOpinion && !showSummary ? 'Ellenőrizd a szűrőket...' : ''}
            </PopoverFooter>
          </PopoverContent>
        </Portal>
      </Popover>
      <InfiniteScroll
        dataLength={sortedPosts.length}
        next={getMorePost}
        hasMore={hasMorePosts}
        loader={<Spinner />}
        endMessage={
          <Text textAlign="center">- a bejegyzések végére értél -</Text>
        }
      >
        {showOpinion &&
          showSummary &&
          sortedPosts.map((post: PostProps) => (
            <PostCard key={post.id} short={true} {...post} hideUser={false} />
          ))}
        {showOpinion &&
          !showSummary &&
          sortedPosts
            .filter(post => post.opinion)
            .map((post: PostProps) => (
              <PostCard key={post.id} short={true} {...post} hideUser={false} />
            ))}
        {showSummary &&
          !showOpinion &&
          sortedPosts
            .filter(post => post.summary)
            .map((post: PostProps) => (
              <PostCard key={post.id} short={true} {...post} hideUser={false} />
            ))}
      </InfiniteScroll>
    </>
  )
}

export default FeedContent
