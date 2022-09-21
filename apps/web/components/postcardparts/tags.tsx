import { Box, HStack, Link, Stack, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { PostCardProps } from 'types/PostCardProps'
import { PostProps } from 'types/PostProps'

export function PostCardTags(
  props: PostProps & PostCardProps & { hide?: boolean },
) {
  if (props.hide) return null
  return (
    <HStack>
      {props.tags && props.tags.map(tag => (
        <NextLink href={`/tags/${tag}`} key={tag} passHref>
          <Link
            px={3}
            py={1}
            bg="gray.600"
            color="gray.100"
            fontSize="sm"
            fontWeight="700"
            rounded="md"
            _hover={{ bg: 'gray.500' }}
            m={0.5}
          >
            {tag}
          </Link>
        </NextLink>
      ))}
    </HStack>
  )
}
