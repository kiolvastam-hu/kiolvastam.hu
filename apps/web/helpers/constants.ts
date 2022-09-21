const { NODE_ENV } = process.env;
export const BASEURL = NODE_ENV == "production" ? "https://kiolvastamhu-production.up.railway.app" : "http://localhost:3030";