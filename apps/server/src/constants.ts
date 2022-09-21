const { NODE_ENV, DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

export const MONGO_URI = NODE_ENV === 'production' ? `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority` : 'mongodb://0.0.0.0:27017';
export default {
	MONGO_URI
}