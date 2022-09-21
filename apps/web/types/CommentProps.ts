export type CommentProps = {
  id: string
  user: {
    username: string
    id: string
  }
  text: string
  createdAt: string
}
