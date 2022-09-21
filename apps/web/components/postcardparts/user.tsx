import { Flex, Image, Link, useMediaQuery } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { PostCardProps } from 'types/PostCardProps'
import { PostProps } from 'types/PostProps'
import { profilePicURL } from '../../helpers/profile'
export function PostCardUser(props: PostProps & PostCardProps) {
  const [isLargerThan640] = useMediaQuery('(min-width: 640px)');
  return (
    <>
      {!props.hideUser && (
        <Flex alignItems="center">
          <NextLink href={`/users/${props.user.username}`} passHref>
            <Link>
              <Image
                mx={4}
                w={10}
                h={10}
                rounded="full"
                fit="cover"
                display={{ base: 'none', sm: 'block' }}
                src={`${profilePicURL(props.user.username)}`}
                alt="avatar"
              />
            </Link>
          </NextLink>
          {isLargerThan640&&<NextLink href={`/users/${props.user.username}`} passHref>
            <Link color="gray" fontWeight="700" cursor="pointer">
              {props.user.username}
            </Link>
          </NextLink>}
        </Flex>
      )}
    </>
  )
}
