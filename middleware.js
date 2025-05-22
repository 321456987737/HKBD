// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// export async function middleware(request) {
//   const token = request.cookies.get("authToken")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/signin", request.url));
//   }

//   try {
//     jwt.verify(token, JWT_SECRET);
//     return NextResponse.next();
//   } catch (err) {
//     console.error("Invalid token:", err);
//     return NextResponse.redirect(new URL("/signin", request.url));
//   }
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/u/:path*"], // Protect these routes
// };