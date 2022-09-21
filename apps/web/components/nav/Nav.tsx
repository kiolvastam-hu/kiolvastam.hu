import {
  AddIcon,
  CloseIcon,
  HamburgerIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Stack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { userService } from '../../services/user.service'

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode()
  const bgColor = useColorModeValue('blue.50', 'blue.900')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [query, setQuery] = useState('')
  const [isPhone] = useMediaQuery('(max-width: 768px)')

  let body = null
  let Links: { url: string; text: string }[] = []
  const [me, setMe] = useState<{ username?: string }>(userService.userValue)
  const router = useRouter()
  const replaceAccents = (str: string) =>
    str.replace('ű', 'u').replace('ő', 'o')
  const handleSearch = async (e: React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault()
    if (query.length > 2) {
      router.push(`/search?q=${replaceAccents(query)}`)
    } else {
      toast.error('Adj meg legalább 3 karaktert!')
    }
  }

  // no authenticated user
  if (!me) {
    Links = [
      { url: '/login', text: 'bejelentkezés' },
      { url: '/register', text: 'regisztráció' },
    ]
  } else {
    Links = [
      { url: '/feed', text: 'hírfolyam' },
      { url: '/following', text: 'követett' },
      { url: '/tags', text: 'címkék' },
    ]
    //authenticated user
    body = (
      <Flex align="center">
        <Box mr={2}>
          <InputGroup>
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Keresés..."
              size="md"
              width={isPhone ? '100%' : 'auto'}
              // handle enter
              onKeyDown={e => {
                console.log(e.key)
                if (e.key === 'Enter') {
                  handleSearch(e)
                }
              }}
              id="input-search"
            />
            <InputRightElement>
              <IconButton
                size="xs"
                aria-label="search"
                icon={<SearchIcon />}
                onClick={handleSearch}
                id="btn-search"
              >
                Keresés
              </IconButton>
            </InputRightElement>
          </InputGroup>
        </Box>

        <NextLink href="/create-post" passHref>
          {isPhone ? (
            <IconButton
              aria-label="create post"
              icon={<AddIcon />}
              variant={'solid'}
              colorScheme={'teal'}
              size={'sm'}
              id="btn-create-post"
              mr="1"
            />
          ) : (
            <Button
              as="a"
              variant={'solid'}
              colorScheme={'teal'}
              size={'sm'}
              mr={2}
              id="btn-create-post"
              leftIcon={<AddIcon />}
            >
              új bejegyzés
            </Button>
          )}
        </NextLink>
        <Menu>
          <MenuButton
            as={Button}
            rounded={'full'}
            variant={'link'}
            cursor={'pointer'}
            minW={0}
            mr={2}
            id="btn-user-menu"
          >
            <Avatar
              size={'sm'}
              src={`https://source.boringavatars.com/beam/120/${me.username}`}
            />
          </MenuButton>
          <MenuList>
            <MenuGroup title={`felhasználó: ${me.username}`}>
              <NextLink href={`/me`} passHref>
                <Link>
                  <MenuItem id="menu-me">profilom</MenuItem>
                </Link>
              </NextLink>
              <NextLink href={`/settings`} passHref>
                <Link>
                  <MenuItem id="menu-settings">beállítások</MenuItem>
                </Link>
              </NextLink>
            </MenuGroup>
            <MenuDivider />
            <MenuItem
              onClick={async () => {
                await userService.logout()
                router.push('/')
              }}
              id="menu-logout"
            >
              kijelentkezés
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    )
  }
  const linkBg = useColorModeValue('gray.200', 'gray.700')
  return (
    <Box
      bg={bgColor}
      px={4}
      // position='fixed' top='0' w={'100%'}
    >
      <Toaster position="bottom-center" />
      <HStack
        spacing={8}
        alignItems={'center'}
        justifyContent={'space-between'}
        h={20}
      >
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <NextLink href={me ? '/feed' : ''} passHref>
          <Link hidden={isPhone}>
            <Flex>
              <Center>
                <Image
                  src="/favicon.png"
                  alt="icon"
                  boxSize={{ base: 6, md: 8, lg: 12 }}
                  mr={3}
                />
              </Center>
              <Center>
                <Heading size={'md'}> Kiolvastam.hu</Heading>
              </Center>
            </Flex>
          </Link>
        </NextLink>
        <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
          {Links.map(link => (
            <NextLink key={link.url} href={link.url} passHref>
              <Link
                px={2}
                py={1}
                rounded={'md'}
                _hover={{
                  textDecoration: 'none',
                  bg: linkBg,
                }}
                id={`link-${link.url.replace('/', '')}`}
              >
                {link.text}
              </Link>
            </NextLink>
          ))}
        </HStack>
        <Flex>{body}</Flex>
        <IconButton
          aria-label="create post"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          size={'sm'}
          onClick={toggleColorMode}
        />
      </HStack>
      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map(link => (
              <NextLink key={link.url} href={link.url} passHref>
                <Link
                  px={2}
                  py={1}
                  rounded={'md'}
                  _hover={{
                    textDecoration: 'none',
                    bg: linkBg,
                  }}
                >
                  {link.text}
                </Link>
              </NextLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}
