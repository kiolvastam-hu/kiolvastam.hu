import { BehaviorSubject } from "rxjs";
import Router from "next/router";
import { BASEURL } from "helpers";
import { axiosInstance } from "../helpers/axiosInstance";
import { UserProps } from "types";


const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('on-user') as string));


export const userService = {
	user: userSubject.asObservable(),
	get userValue() { return userSubject.value },
	login,
	logout,
	register,
	changePassword,
	changeProperty,
	updateUser,
	toggleFollowUser
}

async function login(username: string, password: string) {
	const result = await axiosInstance().post(BASEURL + "/users/login", { username, password }, { withCredentials: true, headers: { 'content-type': 'application/json' } })
	if (result.status != 200) {
		throw new Error("A megadott felhasználónév és jelszó nem egyezik!")
	}
	console.log(result.headers)
	userSubject.next(result.data);
	localStorage.setItem('on-user', JSON.stringify(result.data));
	return result.data;
}

async function changePassword(oldPassword: string, newPassword: string) {
	const response = await axiosInstance().patch(BASEURL + "/users/change-password", { oldPassword, newPassword },
		{ withCredentials: true, headers: { 'content-type': 'application/json' } })

	return response;
}

async function register(username: string, password: string, email: string, dob: string) {
	const { data, status } = await axiosInstance().post(BASEURL + "/users/register", { username, password, email, birthday: dob }, { withCredentials: true, headers: { 'content-type': 'application/json' } })
	console.log({ data, status })
	if (status === 200 || status === 201) {
		userSubject.next(data);
		localStorage.setItem('on-user', JSON.stringify(data));
		Router.push('/feed')
	}
	return data;
}
export async function changeProperty(body: {}) {
	console.log({ body })
	const response = await axiosInstance().put(BASEURL + "/users/me/settings", body,
		{ withCredentials: true, headers: { 'content-type': 'application/json' } });

	return response;
}

async function updateUser({ userId, role }: { userId: string, role: string }) {
	const result = await axiosInstance().put(BASEURL + "/users/update", { userId, role },
		{ withCredentials: true, headers: { 'content-type': 'application/json' } });

	return result;
}

async function toggleFollowUser(username: string) {
	const response = await axiosInstance().put(BASEURL + "/users/" + username + "/follow",{},
		{ withCredentials: true });
	return response;
}

export async function searchUsers(username: string): Promise<[UserProps]> {
	const { data } = await axiosInstance().get(BASEURL + "/users/search/" + username, { withCredentials: true })
	return data;
}
async function logout() {
	await axiosInstance().post(BASEURL + "/users/logout", {}, { withCredentials: true })
	localStorage.removeItem('on-user');
	userSubject.next(null);
	Router.push('/login')
}
