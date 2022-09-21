import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Layout } from 'components'
import { profilePicURL } from 'helpers/profile'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { unescape as serverUnescape } from 'querystring'
import React, { useEffect, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { searchBooks, searchEntries, searchUsers } from 'services'
import { PostProps, UserProps } from 'types'
const Search = ({
  users,
  entries,
  books,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const q = unescape(router.query.q as string)
  useEffect(() => {
    setUserResults(users)
    setEntryResults(entries)
    setBookResults(books)
  })

  const cardBg = useColorModeValue('gray.50', 'gray.700')

  const [userResults, setUserResults] = useState<UserProps[]>(users)
  const [entryResults, setEntryResults] = useState<PostProps[]>(entries)
  const [bookResults, setBookResults] = useState<BookSearchProps[]>(books) // TODO move props to types
  return (
    <Layout>
      <Heading>{q} - találatok:</Heading>
      <br />
      <Box m={1}>
        <Heading size="lg">Felhasználók</Heading>
        {userResults.length === 0 ? (
          <NoResults />
        ) : (
          userResults.map((user: UserProps) => (
            <NextLink href={`/users/${user.username}`} key={user.id} passHref>
              <Flex key={user.id} m="1">
                {' '}
                <Image
                  src={profilePicURL(user.username)}
                  alt="avatar"
                  w="25px"
                  h="25px"
                  mr="2"
                />
                <Highlighter
                  searchWords={[q as string]}
                  textToHighlight={`${user.username} (${user.age}) - ${user.entries.length} bejegyzés`}
                />
              </Flex>
            </NextLink>
          ))
        )}
      </Box>
      <Box m={1}>
        <Heading size="lg">Bejegyzések</Heading>

        {entryResults.length === 0 ? (
          <NoResults />
        ) : (
          entryResults.map((entry: PostProps) => (
            <NextLink href={`/post/${entry.id}`} key={entry.id} passHref>
              <Flex key={entry.id} m="1">
                <Image
                  src={profilePicURL(entry.user.username)}
                  alt="avatar"
                  w="25px"
                  h="25px"
                  mr="2"
                />
                <p>
                  {entry.user.username} - {entry.book.author}/{entry.book.title}
                </p>
              </Flex>
            </NextLink>
          ))
        )}
      </Box>
      <Box m={1}>
        <Heading size="lg">Könyvek</Heading>
        {bookResults.length === 0 ? (
          <NoResults />
        ) : (
          bookResults.map((book: BookSearchProps) => (
            <NextLink
              href={`/book/${book.moly_id}`}
              key={book.moly_id}
              passHref
            >
              <Flex key={book.moly_id} m="1" rounded={'md'} bg={cardBg} p="2">
                <Image
                  src={book.cover_url}
                  alt="cover"
                  w="32px"
                  h="50px"
                  mr="2"
                />
                <Center>
                  <Highlighter
                    searchWords={[q as string]}
                    textToHighlight={`${book.author} - ${book.title}`}
                  />
                </Center>
              </Flex>
            </NextLink>
          ))
        )}
      </Box>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { q } = query
  const userSearchPromise = searchUsers(q as string)
  const entrySearchPromise = searchEntries(q as string)
  const bookSearchPromise = searchBooks(q as string)
  const [users, entries, books] = await Promise.all([
    userSearchPromise,
    entrySearchPromise,
    bookSearchPromise,
  ])
  console.log(users)
  return {
    props: {
      users,
      entries,
      books,
    },
  }
}
export default Search

type BookSearchProps = {
  author: string
  title: string
  pub_year: number
  moly_id: number
  cover_url: string
}

const NoResults = () => <Text>Nincs találat</Text>
