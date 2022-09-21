import React from 'react'
import NextLink from 'next/link'
import {
  Box,
  Flex,
  Link,
  useColorModeValue,
  Text,
  Image,
} from '@chakra-ui/react'
import { PostCardProps, PostProps } from 'types'

export function PostCardBookDetails(
  props: PostProps & PostCardProps & { hide?: boolean },
) {
  const titleColor = useColorModeValue('gray.700', 'white')
  const hoverColor = useColorModeValue('gray.600', 'gray.200')
  const content = (
    <Flex justifyContent="space-between">
      <Box
        fontSize="2xl"
        color={titleColor}
        fontWeight="700"
        _hover={{
          color: hoverColor,
        }}
       
      >
        <Text>{props.book.title}</Text>

        <Text fontSize={'sm'} color="gray">
          {props.book.author}
        </Text>
        {props.short ? (
          ''
        ) : (
          <Text fontSize={'xs'} color="gray">
            Kiadás éve: {props.book.pub_year}
          </Text>
        )}
      </Box>
      <Image
        src={props.book.cover_url}
        alt="book"
        w="99px"
        h="140px"
        transitionProperty="shadow"
        transitionDuration="1"
        transitionTimingFunction="ease-in-out"
        _hover={{ shadow: '2xl' }}
      />
    </Flex>
  )
  if (props.hide) return null
  if (props.short) {
    return content
  } else {
    return (
      <NextLink href={`/book/${props.book.moly_id}`} passHref>
        <Link style={{ textDecoration: 'none', }}>{content}</Link>
      </NextLink>
    )
  }
}
