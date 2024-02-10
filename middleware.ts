import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: '/',
        error: '/error'
    }
})

export const config = {
    matcher: [
        "/home/:path*"
    ]
}

//relevant docs and references
// cannot use getServerSession in middleware, issue found here: https://github.com/nextauthjs/next-auth/issues/7732
// recommended solution: https://next-auth.js.org/configuration/nextjs#middleware
// solution redirects indiscriminately even on the greeting page ("/"), so added config
// config matcher to only match paths and beyond: https://nextjs.org/docs/app/building-your-application/routing/middleware