import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  debug: true,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("https://ems-backend-nkom.onrender.com/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const data = await res.json();

        if (res.status === 403 || !data.user?.isApproved)
          throw new Error("NotApproved");
        if (res.status === 401) throw new Error("InvalidCredentials");
        if (!res.ok || !data.user) throw new Error("LoginFailed");

        return {
          id: data.user._id,
          name: `${data.user.fname} ${data.user.lname}`,
          email: data.user.email,
          role: data.user.role,
          isApproved: data.user.isApproved,
          fname: data.user.fname,
          lname: data.user.lname,
          provider: data.user.provider,
        };
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (["github", "google"].includes(account.provider)) {
        const res = await fetch("https://ems-backend-nkom.onrender.com/api/oauth-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name || "",
            provider: account.provider,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.user?.isApproved) {
          return "/login?error=NotApproved";
        }
        user.id = data.user._id;
        user.role = data.user.role;
        user.fname = data.user.fname;
        user.lname = data.user.lname;
        user.isApproved = data.user.isApproved;
        user.provider = data.user.provider;
        user.redirectTo = data.user.role === "admin" ? "/admindash/overview" : `/userdash/${data.user._id}`;
        return true;
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fname = user.fname;
        token.lname = user.lname;
        token.role = user.role;
        token.isApproved = user.isApproved;
        token.provider = user.provider;
        token.redirectTo = user.redirectTo;
      }
      console.log("JWT callback:", token);
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.fname = token.fname;
        session.user.lname = token.lname;
        session.user.role = token.role;
        session.user.isApproved = token.isApproved;
        session.user.provider = token.provider;
        session.redirectTo = token.redirectTo;
      }
      console.log("Session callback:", session);
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  events: {
    async signInFailure({ error }) {
      console.error("Sign-in failed:", error);
    },
  },
};

export const { auth, handlers } = NextAuth(authOptions);
export const GET = handlers.GET;
export const POST = handlers.POST;