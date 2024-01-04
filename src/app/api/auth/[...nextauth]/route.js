import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import  { db } from "@component/utils/db"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        try {
          const query = `select * from fleet.admin where username = '${credentials.username}'`;
          const user = await new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
              if (err) {
                console.error("Database query error:", err);
                reject(err);
              } else if (result.length === 0) {
                console.log("User not found");
                reject(new Error("User not found"));
              } else {
                const retrievedUser = result[0];
                const userObject = { ...retrievedUser };
                if (credentials.password === userObject.password) {
                  console.log("Password matches");
                  resolve(userObject);
                } else {
                  console.log("Password does not match");
                  reject(new Error("Wrong Credentials"));              }
             }
            });
          });
          return user;
        } catch (err) {
          throw new Error(err);
        }
      },
    })    
  ],
  callbacks: {
    async signIn({ user }){
        if(user){
          return true
        }
        return false
    },
    async jwt({ token, user }) {
      return {...token, ...user};
    },
    async session({session, token}) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.jti = token.jti;
      return session
    },
  },
  // For Getting the Error on the specific page
  session: {
    strategy: 'jwt',
    maxAge :  60 * 60
  },
  pages:{
    error:'/dashboard/login'
  }
})
 

export { handler as GET, handler as POST};