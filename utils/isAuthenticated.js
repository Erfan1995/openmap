import nookies from "nookies";
import { getMethod } from "../lib/api";
export default async function isAuthenticated(ctx) {
    const { token } = nookies.get(ctx);
    try {
        if (token) {
            const verify = await getMethod('users/me',token)
            if (verify) {
                return verify;
            } else {
                return false;
            }

        }
        return false;
    } catch (e) {
        return false;
    }
}