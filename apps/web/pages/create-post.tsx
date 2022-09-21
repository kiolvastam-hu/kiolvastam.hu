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
              1. keresés
            </BreadcrumbLink>
          </BreadcrumbItem>
          {progress > 0 && (
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => setProgress(1)}>
                2. kiadás kiválasztása
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          {progress > 1 && (
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>3. vélemény</BreadcrumbLink>
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
                  <AlertTitle>Kezdj el gépelni a keresőbe!</AlertTitle>
                  <AlertDescription>
                    <Text>Kereshetsz könyv címre, vagy akár szerzőre is.</Text>
                    <Text>
                      A kereső a{' '}
                      <a
                        href="https://moly.hu"
                        target={'_blank'}
                        rel="noreferrer"
                      >
                        moly.hu
                      </a>{' '}
                      adatbázisából keresi meg a könyveket.
                    </Text>
                  </AlertDescription>
                </>
              )}
              {progress == 1 && (
                <>
                  <AlertTitle>Kiadás kiválasztása</AlertTitle>
                  <AlertDescription>
                    A kiadás kiválasztásához kattints a lista egyik elemére.
                  </AlertDescription>
                </>
              )}
              {progress == 2 && (
                <>
                  <AlertTitle>összefoglalás - vélemény</AlertTitle>
                  <AlertDescription>
                    <Text>
                      A címkék közül választhatsz, hogy melyiket szeretnéd
                      hozzáadni a bejegyzéshez. Ha szeretnéd, megadhatsz saját
                      címkét is.
                    </Text>
                    <Text>
                      Az összefoglalás mezőben megadhatsz egy rövid
                      összefoglalást a könyvről.
                    </Text>
                    <Text>
                      A vélemény mezőben megadhatod saját vélmeényed a könyvről.
                    </Text>
                    <Text>
                      A vélemény és az összefoglalás mező közül legalább az
                      egyiket ki kell töltened.
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
            toast.error('Hiba történt a mentés során')
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
                placeholder="Könyv cím..."
              />
            )}
            {loading && <Spinner mt="2" />}
            {progress == 0 && books.length > 0 && (
              <>
                <Text>{books.length} találat </Text>
                {books.length > 0 && (
                  <Text>kattintással válaszd ki a könyvet!</Text>
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
                <small>Szerző</small>
                <Heading size="md">{book.author}</Heading>
                <small>Cím</small>
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
                  <FormLabel htmlFor="tags">címkék</FormLabel>

                  <CreatableSelect
                    name="tags"
                    id="tags"
                    placeholder="válassz..."
                    options={[
                      {
                        label: 'címkék',
                        options: bookData.tags.map(tag => ({
                          label: tag.name,
                          value: tag.name, //tpdo id
                        })),
                      },
                    ]}
                    isMulti
                    formatCreateLabel={(inputValue: string) =>
                      `"${inputValue}" hozzáadása`
                    }
                    noOptionsMessage={() => 'Nincs találat'}
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
                  label="összefoglalás"
                  name="summary"
                  placeholder='"A könyv arról szól..."'
                  textarea
                  rows={6}
                  mt={2}
                />
                <InputField
                  label="vélemény"
                  name="opinion"
                  placeholder='"Számomra a könyv azért volt érdekes..."'
                  textarea
                  rows={10}
                  defaultValue=""
                  mt={2}
                />
                <Button type="submit" isLoading={isSubmitting} mt={2}>
                  bejegyzés mentése
                </Button>
              </>
            )}
          </Form>
        )}
      </Formik>
    </Layout>
  )
}
