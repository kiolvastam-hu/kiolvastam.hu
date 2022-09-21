import axios from "axios"

export const axiosInstance = () =>{
	const axiosClient = axios.create({validateStatus:()=>true})
	return axiosClient
}