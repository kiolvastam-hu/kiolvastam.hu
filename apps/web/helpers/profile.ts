import { differenceInYears, parse } from "date-fns"

export const profilePicURL = (username: string) => {
	return `https://source.boringavatars.com/beam/120/${username}`
}

export const calculateAge = (dob: string): number => {

	return differenceInYears(new Date(), new Date(dob))
	 
}