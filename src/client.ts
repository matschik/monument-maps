import { dev } from '$app/environment';
import { HoudiniClient } from '$houdini';

const baseURL = dev ? "http://localhost:5173" : "https://monument-maps.vercel.app";

export default new HoudiniClient({
	url: `${baseURL}/api/graphql`
});
