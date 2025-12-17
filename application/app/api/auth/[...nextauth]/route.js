import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "../../../../lib/prisma";

const TWO_WEEKS = 60 * 60 * 24 * 14;

export const authOptions = {

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;



        //here we are assuming the students password is not hashed

        
       const student = await prisma.student.findUnique({
        where:{email:credentials.email, password:credentials.password} })  

        if (!student ) return null;

        
        
        return {
          id: student.id,
          email: student.email,
          name: student.name,
        };
      },
    }),
  ],

  session: {
     strategy: "jwt",
     maxAge:TWO_WEEKS

  },

  pages: {
    signIn: "/login",
  },
}
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };



