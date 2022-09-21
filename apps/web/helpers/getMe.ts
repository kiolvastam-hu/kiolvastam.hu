import axios from "axios";
import { BASEURL } from 'helpers/constants'

export default async function getMe() {
	try {
		const { data } = await axios.get(BASEURL + "/users/me", {
			withCredentials: true,
		});
		return data;
	} catch (e) {
		return {}
	}
}