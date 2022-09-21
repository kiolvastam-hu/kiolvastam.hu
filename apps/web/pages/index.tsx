import { StarIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react'
import { Spacer } from 'components'
import NextImage from 'next/image'
import NextLink from 'next/link'
import { Layout } from '../components/Layout'
const Index = () => (
  <Layout>
    <Flex justify={'space-between'}>
      <Box>
        <Heading>kiolvastam.hu</Heading>
        <Spacer />
        <Heading size="md">Befejeztél egy könyvet?</Heading>
        <Text mb="2">
          Az alkalmazásban létrehozhatod virtuális olvasónaplódat, közzéteheted
          a véleményedet az olvasmányaidról!
        </Text>
        <Spacer />
        <Heading size="md">Épp a következő olvasmányodat keresed?</Heading>
        <Text>
          Böngéssz a többi felhasználó véleménye, és gondolatai közt, hogy
          megtaláld! Ha elolvastad, írj róla te is!
        </Text>
        <Spacer />
        <Heading size="md">Fejezd ki a véleményed!</Heading>
        <Text>
          Mások bejegyzéseire reagálhatsz a <StarIcon /> megnyomásával, illetve
          írhatsz hozzászólásokat!
        </Text>
        <Spacer />
        <Heading size="md"> Mire vársz még?</Heading>
        <Text>
          <NextLink href="/register" passHref>
            <Link>Regisztrálj!</Link>
          </NextLink>
        </Text>
      </Box>
      <NextImage
        // layout="responsive"
        src="/images/bookshelf.svg"
        width="320px"
        height="246px"
      />
    </Flex>
  </Layout>
)

export default Index
