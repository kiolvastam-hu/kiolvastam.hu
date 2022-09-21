import axios from 'axios'
import { BASEURL } from 'helpers'

export default async function logout() {
	const { data } = await axios.post(BASEURL + "/users/logout", {}, {
		withCredentials: true
	});
	return data
}