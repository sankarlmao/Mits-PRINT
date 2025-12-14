// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});
export const config = {
  matcher: [
    /*
     * Protect everything except:
     * - /login
     * - /api/auth
     * - static files
     */
    "/((?!login|api/auth|_next|favicon.ico).*)",
  ],
};
