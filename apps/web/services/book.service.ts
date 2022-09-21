import { axiosInstance, BASEURL } from "helpers";

export async function searchBooks(query: string) {
	const { data, status } = await axiosInstance().get(BASEURL + '/books/search/' + query, {
		withCredentials: true,
		headers: { 'content-type': 'application/json' }
	});
	return data;
}