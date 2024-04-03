import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/app/auth/mongoClient"
import { NextAuthOptions } from "next-auth";
import AzureADProvider from 'next-auth/providers/azure-ad'; 


const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise,{databaseName: process.env.MONGO_CONNECTION_DATABASE}),
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID!,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
        tenantId: process.env.AZURE_AD_TENANT_ID,
      }),
    ],
    session:{
      strategy: "jwt",
    }
  };


  export default authOptions;