import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { Layout } from 'components'
import { BASEURL } from 'helpers/constants'
import { InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Tag } from 'types'
const Tags = ({
  tags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const boxBg = useColorModeValue('gray.50', 'gray.700')

  return (
    <Layout>
      {tags.map(tag => (
        <Box
          key={tag.tag}
          id="tag-item"
          mx="auto"
          mb={3}
          px={8}
          py={4}
          rounded="lg"
          shadow="lg"
          bg={boxBg}
          style={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          <Link href={`/tags/${tag.tag}`} passHref>
            <Flex justifyContent="center" flexDir={'column'}>
              {' '}
              <Heading>{tag.tag}</Heading>
              <Text>{tag.count} db bejegyzés</Text>
              <Box>
                {/* show first random 5 cover */}
                {tag.covers.slice(0, 5).map(cover => (
                  <Image
                    key={cover}
                    src={cover}
                    alt={`${tag.tag} címkével ellátott bejgyezések`}
                    width="60px"
                    height="90px"
                  />
                ))}
              </Box>
            </Flex>
          </Link>
        </Box>
      ))}
    </Layout>
  )
}



export async function getServerSideProps() {
  const result = await fetch(BASEURL + '/tags')
  const tags: Tag[] = await result.json()

  return {
    props: {
      tags,
    }, // will be passed to the page component as props
  }
}
export default Tags
