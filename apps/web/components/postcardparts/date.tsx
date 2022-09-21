import { chakra, useColorModeValue } from '@chakra-ui/react'
import { formatRelative } from 'date-fns'
import { hu } from 'date-fns/locale'
import React from 'react'
import { PostProps } from 'types/PostProps'

export function PostCardDate(props: PostProps) {
  const edited = props.updatedAt && props.updatedAt !== props.createdAt

  return (
      <chakra.span
        fontSize="sm"
        color={useColorModeValue('gray.600', 'gray.400')}
      >
        {formatRelative(new Date(props.createdAt), new Date(), {
          locale: hu,
        })}{' '}
        {edited && (
          <p>
            <small>
              módosítva{' '}
              {formatRelative(new Date(props.updatedAt), new Date(), {
                locale: hu,
              })}
            </small>
          </p>
        )}
      </chakra.span>
  )
}
