import { BASEURL } from "helpers"
import { axiosInstance } from "../helpers/axiosInstance";

type EntryDTO = {
	opinion: string;
	summary: string;
	tags: string[];
	book: BookDTO
}

type EntryUpdateDTO = {
	private?: boolean
	showComments?: boolean
	opinion?: string;
	summary?: string;
}

type BookDTO = {
	title: string;
	author: string;
	pub_year: number;
	cover_url: string;
	moly_id: number;
}

export async function createEntry(entry: EntryDTO) {
	const { data, status } = await axiosInstance().post(BASEURL + '/entries', entry, {
		withCredentials: true,
		headers: { 'content-type': 'application/json' }
	});
	// if (status != 201) {
	// 	throw new Error("hiba a mentes soran")
	// }
	return data;
}

export async function deleteEntry(entryId: string) {
	const { data, status } = await axiosInstance().delete(BASEURL + '/entries/' + entryId, {
		withCredentials: true,
		headers: { 'content-type': 'application/json' }
	});
	// if (status != 201) {
	// 	throw new Error("hiba a mentes soran")
	// }
	return status;
}

export async function updateEntry(entryId: string, entry: EntryUpdateDTO) {
	const { data, status } = await axiosInstance().patch(BASEURL + '/entries/' + entryId, entry, {
		withCredentials: true,
		headers: { 'content-type': 'application/json' }
	});
	return data;
}

export async function createComment(entryId: string, comment: string) {
	const { data, status } = await axiosInstance().post(BASEURL + '/entries/' + entryId + '/comments', {
		comment
	}, {
		withCredentials: true,
		headers: { 'content-type': 'application/json' }
	});

	return data;
}

export async function deleteComment(entryId: string, commentId: string) {
	const { data, status } = await axiosInstance().delete(BASEURL + '/entries/' + entryId + '/comments/' + commentId, {
		withCredentials: true,
		headers: { 'content-type': 'application/json' }
	});

	return status;
}

export async function likeEntry(entryId: string) {
	const { data, status } = await axiosInstance().post(BASEURL + '/entries/' + entryId + '/likes', {}, {
		withCredentials: true,
		headers: { 'content-type': 'application/json' }
	});
	return data;
}

export async function searchEntries(search: string) {
	const { data, status } = await axiosInstance().get(BASEURL + '/entries/search/' + search, {
		withCredentials: true,
		headers: { 'content-type': 'application/json' }
	});
	return data;
}