import { EmailIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link,
  Radio,
  Select,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import axios from 'axios'
import PostCard from 'components/PostCard'
import { formatRelative } from 'date-fns'
import { hu } from 'date-fns/locale'
import { BASEURL } from 'helpers'
import { calculateAge, profilePicURL } from 'helpers/profile'
import NextImage from 'next/image'
import NextLink from 'next/link'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { HiUserAdd, HiUserRemove } from 'react-icons/hi'
import { userService } from 'services'
import useSWR, { Fetcher } from 'swr'
import { UserProps } from 'types'
function UserProfile(props: UserProps) {
  const me = userService.userValue

  const fetcher: Fetcher<{ following: boolean }> = (url: string) =>
    axios.get(url, { withCredentials: true }).then(r => r.data)
  const { data, error } = useSWR(
    `${BASEURL}/users/${props.username}/following`,
    fetcher,
  )
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const toggleFollow = async () => {
    setIsLoading(true)
    const result = await userService.toggleFollowUser(props.username)
    if (result.status === 200) {
      setIsFollowing(!isFollowing)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    setIsFollowing(data?.following ?? false)
  }, [data])
  return (
    <>
      <Flex justifyContent={'space-between'}>
        <Box>
          <Heading>
            {props.username}{' '}
            {!props.birthdayPrivate && `(${calculateAge(props.birthday)} éves)`}
          </Heading>
          {!props.emailPrivate && (
            <Text>
              <EmailIcon mr={1} />
              <a href={`mailto:${props.email}`}>{props.email}</a>
            </Text>
          )}
          {me && me.role === 'admin' && props.id !== me.id && (
            <Select
              onChange={async e => {
                const result = await userService.updateUser({
                  userId: props.id,
                  role: e.target.value,
                })
                if (result.status === 200) {
                  toast.success(
                    'Sikeres módosítás!\nA következő bejelentkezés után a felhasználó már az új státusszal fog rendelkezni.',
                    {
                      duration: 3000,
                    },
                  )
                } else {
                  toast.error('Hiba történt a módosítás során!')
                }
              }}
              size="sm"
            >
              <option
                value="user"
                selected={props.role === 'user' ? true : false}
              >
                Felhasználó
              </option>
              <option
                value="moderator"
                selected={props.role === 'moderator' ? true : false}
              >
                Moderátor
              </option>
            </Select>
          )}
          <Text>
            {formatRelative(new Date(props.createdAt), new Date(), {
              locale: hu,
            })}{' '}
            regisztrált
          </Text>
          <Text>{props.entries.length} bejegyzés</Text>
        </Box>
        <Stack>
          <NextImage
            src={profilePicURL(props.username)}
            width="100px"
            height="100px"
            alt={props.username}
          />
          {!(me && me.username == props.username) &&
            (isFollowing ? (
              <Button
                leftIcon={<HiUserRemove />}
                onClick={toggleFollow}
                isLoading={isLoading}
                colorScheme="red"
              >
                Követés
                <br />
                megszüntetése
              </Button>
            ) : (
              <Button
                onClick={toggleFollow}
                leftIcon={<HiUserAdd />}
                isLoading={(!error && !data) || isLoading}
                colorScheme="green"
              >
                Követés
              </Button>
            ))}
        </Stack>
      </Flex>
      {props.entries.length > 0 ? (
        <Tabs variant="soft-rounded" colorScheme="green">
          <Center>
            <TabList>
              <Tab>Bejegyzések</Tab>
              <Tab>Könyvespolc</Tab>
            </TabList>
          </Center>
          <TabPanels>
            <TabPanel>
              {props.entries.map(post => (
                <PostCard key={post.id} short {...post} hideUser />
              ))}
            </TabPanel>
            <TabPanel>
              <Flex justify="flex-start">
                {props.entries.length > 0 &&
                  props.entries.map(post => (
                    <NextLink href={`/post/${post.id}`} key={post.id} passHref>
                      <Link>
                        <Image
                          key={post.id}
                          src={post.book.cover_url}
                          alt={post.book.title}
                          height="260px"
                          m={2}
                          transitionProperty="shadow"
                          transitionDuration="1"
                          transitionTimingFunction="ease-in-out"
                          _hover={{ shadow: '2xl', height: '325px' }}
                        />
                      </Link>
                    </NextLink>
                  ))}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <Box>
          <Text>Biztos épp olvas...</Text>
          <Center>
            <NextImage
              src="/images/book.svg"
              alt="book"
              width="320px"
              height="246px"
            />
          </Center>
        </Box>
      )}
    </>
  )
}

export default UserProfile
