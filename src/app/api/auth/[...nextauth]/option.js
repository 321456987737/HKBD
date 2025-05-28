import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/dbConnect"; // MongoDB connection utility
import bcrypt from "bcrypt";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Credentials Provider (Email + Password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const client = await clientPromise;
          const db = client.db("your_db_name"); // 🔁 Replace with your DB name
          const usersCollection = db.collection("users");

          const user = await usersCollection.findOne({ email });

          if (!user) {
            throw new Error("No user found with this email");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  callbacks: {
    // 🔐 Called whenever a token is created or updated
    async jwt({ token, user, account }) {
      const client = await clientPromise;
      const db = client.db("your_db_name"); // 🔁 Replace with your DB name
      const users = db.collection("users");

      // Handle Google OAuth
      if (account?.provider === "google") {
        const existingUser = await users.findOne({ email: token.email });

        if (!existingUser) {
          const username = token.email.split("@")[0]; // ✅ Ensure username is a string
          const newUser = {
            email: token.email,
            username,
            createdAt: new Date(),
          };

          const result = await users.insertOne(newUser);

          token.id = result.insertedId.toString();
          token.username = username;
        } else {
          token.id = existingUser._id.toString();
          token.username = existingUser.username;
        }
      }

      // Handle Credentials login
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }

      return token;
    },

    // 📦 Add custom fields to the session object
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          username: token.username,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin", // Custom sign-in page
  },
};
