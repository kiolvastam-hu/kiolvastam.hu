import { PostProps } from "types"

export type UserProps = {
	id: string
	username: string
	entries: PostProps[]
	createdAt: string
	birthday: string
	age: number
	email: string
	emailPrivate: boolean
	birthdayPrivate: boolean
	role: 'user' | 'moderator' | 'admin'
	// entryCount: number
}
