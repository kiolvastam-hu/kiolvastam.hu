import { Box, Button, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { Layout } from '../components/Layout'

const Custom404Page = () => {
  return (
    <Layout>
      <Custom404 />
    </Layout>
  )
}

export const Custom404 = () => (
  <Box>
    <Heading>404</Heading>
    <Text> A keresett oldal nem található.</Text>
    <Link href="/" passHref>
      <Button as="a">Kezdőlap</Button>
    </Link>
  </Box>
)
export default Custom404Page
