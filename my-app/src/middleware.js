//frontend/my-app/src/middleware.js
import { auth } from "@/auth";

export default auth;

export const config = {
  matcher: ["/userdash/:path*", "/admindash/:path*"],
};