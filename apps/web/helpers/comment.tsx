import { Text } from '@chakra-ui/react'

export default function parseCommentText(text: string) {
  const usernames = text.match(/@[a-zA-Z0-9_]+/g)
  if (usernames) {
    usernames.forEach(username => {
      text = text.replace(
        username,
        '<b><a href="/users/' + username.substring(1) + '">' + username + '</a></b>',
      )
    })
  }
  return (
    <Text
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    ></Text>
  )
}
