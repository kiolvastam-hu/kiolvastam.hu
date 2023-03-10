/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  CloseButton,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  ListItem,
  Spinner,
  Stack,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react'
import { CreatableSelect } from 'chakra-react-select'
import { Form, Formik, useField } from 'formik'
import { debounce } from 'lodash'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import nProgress from 'nprogress'
import React, { useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { InputField } from '../components/InputField'
import { Layout } from '../components/Layout'
import { axiosInstance } from '../helpers/axiosInstance'
import { toErrorMap } from '../helpers/toErrorMap'
import { createEntry } from '../services/entry.service'
import { Edition } from './api/books/editions/[id]'
export type BookType = {
  title: string
  author: string
  id: number
  cover_url: string
  pub_year: number
}

export default function CreatePost() {
  const router = useRouter()

  const [bookQuery, setBookQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [books, setBooks] = useState<BookType[]>([])
  const [book, setBook] = useState<BookType | null>(null)
  const [editions, setEditions] = useState<Edition[]>([])
  const [edition, setEdition] = useState<Edition | null>(null)

  const [bookData, setBookData] = useState<{
    tags: [{ id: number; name: string }]
  }>({ tags: [{ id: 0, name: '' }] })

  const setActiveBook = async (book: BookType) => {
    setBook(book)
    const [{ data: editions }, { data: bookData }] = await Promise.all([
      axiosInstance().get(`/api/books/editions/${book.id}`),
      axiosInstance().get(`/api/books/${book.id}`),
    ])
    setEditions(editions as Edition[])
    setBookData(bookData as { tags: [{ id: number; name: string }] })
  }

  const handleBookQueryChange = (q: string) => {
    setBookQuery(q)
  }

  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: true })

  // set onopen every time progress changes
  useEffect(() => {
    onOpen()
  }, [progress])

  const [tagsError, setTagsError] = useState('')
  const debouncedApiCall = useCallback(
    debounce(async text => {
      if (!text) return
      nProgress.start()
      setLoading(true)
      axiosInstance()
        .post('/api/moly?query=' + text)
        .then(({ data: books }) => {
          console.log(books)
          setBooks(books)
          setLoading(false)
          nProgress.done()
        })
    }, 400),
    [],
  )
  useEffect(() => {
    debouncedApiCall(bookQuery)
  }, [bookQuery, debouncedApiCall])
  return (
    <Layout>
      <Toaster position="bottom-center" />
      <Center>
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => setProgress(0)}>
              1. keres??s
            </BreadcrumbLink>
          </BreadcrumbItem>
          {progress > 0 && (
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => setProgress(1)}>
                2. kiad??s kiv??laszt??sa
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          {progress > 1 && (
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>3. v??lem??ny</BreadcrumbLink>
            </BreadcrumbItem>
          )}
        </Breadcrumb>
      </Center>
      <br />
      
      {isVisible && (
          <Alert status="info" rounded={'md'}>
            <AlertIcon />
              {progress == 0 && (
                <>
                  <AlertTitle>Kezdj el g??pelni a keres??be!</AlertTitle>
                  <AlertDescription>
                    <Text>Kereshetsz k??nyv c??mre, vagy ak??r szerz??re is.</Text>
                    <Text>
                      A keres?? a{' '}
                      <a
                        href="https://moly.hu"
                        target={'_blank'}
                        rel="noreferrer"
                      >
                        moly.hu
                      </a>{' '}
                      adatb??zis??b??l keresi meg a k??nyveket.
                    </Text>
                  </AlertDescription>
                </>
              )}
              {progress == 1 && (
                <>
                  <AlertTitle>Kiad??s kiv??laszt??sa</AlertTitle>
                  <AlertDescription>
                    A kiad??s kiv??laszt??s??hoz kattints a lista egyik elem??re.
                  </AlertDescription>
                </>
              )}
              {progress == 2 && (
                <>
                  <AlertTitle>??sszefoglal??s - v??lem??ny</AlertTitle>
                  <AlertDescription>
                    <Text>
                      A c??mk??k k??z??l v??laszthatsz, hogy melyiket szeretn??d
                      hozz??adni a bejegyz??shez. Ha szeretn??d, megadhatsz saj??t
                      c??mk??t is.
                    </Text>
                    <Text>
                      Az ??sszefoglal??s mez??ben megadhatsz egy r??vid
                      ??sszefoglal??st a k??nyvr??l.
                    </Text>
                    <Text>
                      A v??lem??ny mez??ben megadhatod saj??t v??lme??nyed a k??nyvr??l.
                    </Text>
                    <Text>
                      A v??lem??ny ??s az ??sszefoglal??s mez?? k??z??l legal??bb az
                      egyiket ki kell t??ltened.
                    </Text>
                  </AlertDescription>
                </>
              )}

            <CloseButton
              alignSelf="flex-start"
              position="relative"
              right={-1}
              top={-1}
              onClick={onClose}
              />
          </Alert>
      )}
      <Formik
        initialValues={{
          author: '',
          title: '',
          moly_id: 0,
          pub_year: 0,
          cover_url: '',
          opinion: '',
          summary: '',
          tags: [''],
        }}
        onSubmit={async (values, { setErrors }) => {
          try {
            const data = await createEntry({
              book: {
                title: values.title,
                author: values.author,
                moly_id: values.moly_id,
                pub_year: values.pub_year,
                cover_url: values.cover_url,
              },
              opinion: values.opinion,
              summary: values.summary,
              tags: values.tags,
            })

            if (data.errors) {
              const errorMap = toErrorMap(data.errors)
              setErrors(errorMap)
              console.log({ errorMap })
              const generalErrors = data.errors.filter(
                (e: { param: string }) => e.param === '__general',
              )
              if (generalErrors.length > 0) {
                toast.error(() => (
                  <>
                    {generalErrors[0].msg}
                    {/* <NextLink href={generalErrors[0].redirect}></NextLink> */}
                  </>
                ))
              }
              setTagsError(
                data.errors.filter(
                  (e: { param: string; msg: string }) => e.param === 'tags',
                )[0].msg,
              )
            } else {
              router.push(`/post/${data.id}`)
            }
          } catch (error) {
            toast.error('Hiba t??rt??nt a ment??s sor??n')
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            {progress == 0 && (
              <Input
                value={bookQuery}
                onChange={e => handleBookQueryChange(e.target.value)}
                disabled={loading}
                placeholder="K??nyv c??m..."
              />
            )}
            {loading && <Spinner mt="2" />}
            {progress == 0 && books.length > 0 && (
              <>
                <Text>{books.length} tal??lat </Text>
                {books.length > 0 && (
                  <Text>kattint??ssal v??laszd ki a k??nyvet!</Text>
                )}
                <br />
                <UnorderedList>
                  {books.map((book, index) => (
                    <ListItem
                      key={book.id}
                      onClick={() => {
                        const book = books[index]
                        setActiveBook(book)
                        setFieldValue('moly_id', book.id)
                        setFieldValue('title', book.title)
                        setFieldValue('author', book.author)
                        setProgress(1)
                      }}
                    >
                      {book.author} - {book.title}
                    </ListItem>
                  ))}
                </UnorderedList>
              </>
            )}
            {progress > 0 && book && (
              <Box>
                <small>Szerz??</small>
                <Heading size="md">{book.author}</Heading>
                <small>C??m</small>
                <Heading size="md">{book.title}</Heading>
              </Box>
            )}
            {progress == 1 && book && (
              <Flex flexWrap="wrap" id="editions">
                {editions.map((edition, index) => (
                  <Box
                    id="edition"
                    key={edition.id}
                    m="2"
                    p="2"
                    borderWidth="1px"
                    borderRadius="lg"
                    alignContent={'center'}
                    justifyContent={'center'}
                    width="120px"
                    _hover={{ shadow: 'xl' }}
                    onClick={() => {
                      setEdition(edition)
                      setFieldValue('pub_year', edition.year)
                      setFieldValue('cover_url', edition.cover)
                      setProgress(2)
                    }}
                  >
                    <Flex flexDir={'column'} justifyContent="space-between">
                      <Center>
                        <Image
                          src={edition.cover}
                          alt={edition.publisher}
                          width="100px"
                          height="125px"
                        />
                      </Center>
                      {/* <Spacer /> */}
                      <Text>
                        {edition.publisher} ({edition.year})
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            )}
            {progress == 2 && (
              <>
                <FormControl>
                  <FormLabel htmlFor="tags">c??mk??k</FormLabel>

                  <CreatableSelect
                    name="tags"
                    id="tags"
                    placeholder="v??lassz..."
                    options={[
                      {
                        label: 'c??mk??k',
                        options: bookData.tags.map(tag => ({
                          label: tag.name,
                          value: tag.name, //tpdo id
                        })),
                      },
                    ]}
                    isMulti
                    formatCreateLabel={(inputValue: string) =>
                      `"${inputValue}" hozz??ad??sa`
                    }
                    noOptionsMessage={() => 'Nincs tal??lat'}
                    onChange={event => {
                      setFieldValue(
                        'tags',
                        event.map(e => e.label),
                      )
                    }}
                  />
                  {tagsError && <Text color="red">{tagsError}</Text>}
                </FormControl>

                <InputField
                  label="??sszefoglal??s"
                  name="summary"
                  placeholder='"A k??nyv arr??l sz??l..."'
                  textarea
                  rows={6}
                  mt={2}
                />
                <InputField
                  label="v??lem??ny"
                  name="opinion"
                  placeholder='"Sz??momra a k??nyv az??rt volt ??rdekes..."'
                  textarea
                  rows={10}
                  defaultValue=""
                  mt={2}
                />
                <Button type="submit" isLoading={isSubmitting} mt={2}>
                  bejegyz??s ment??se
                </Button>
              </>
            )}
          </Form>
        )}
      </Formik>
    </Layout>
  )
}
