import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/app/auth/mongoClient"
import { NextAuthOptions } from "next-auth";


const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise,{databaseName: "pharmacy-assistant"}),
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
    ],
    session:{
      strategy: "jwt",
    }
  };


  export default authOptions;