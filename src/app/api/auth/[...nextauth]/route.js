// app/api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/db';
import Employee from '@/models/Employee';

// Define admin credentials
const ADMIN_CREDENTIALS = [
  { mobile: '7029481930', password: 'hfadmin' }
  // You can add more admin credentials here as needed
  // { mobile: 'another_number', password: 'another_password' }
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        mobile: { label: 'Mobile', type: 'text' },
        password: { label: 'Password', type: 'password' },
        loginType: { label: 'Login Type', type: 'text' }
      },
      async authorize(credentials) {
        await connectDB();
        const { mobile, password, loginType } = credentials;

        // Check for admin login
        if (loginType === 'admin') {
          const adminCred = ADMIN_CREDENTIALS.find(cred => 
            cred.mobile === mobile && cred.password === password
          );
          
          if (adminCred) {
            return {
              id: 'admin',
              name: 'Administrator',
              mobile: mobile,
              role: 'admin'
            };
          }
          return null;
        }

        // Regular employee login
        const user = await Employee.findOne({ 
          mobile,
          role: loginType
        });

        if (!user) return null;

        const birthYear = new Date(user.dob).getFullYear();
        const nameFirst4 = user.name.slice(0, 4).toLowerCase();
        const expectedPassword = `${birthYear}${nameFirst4}`;

        if (password === expectedPassword) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email || '',
            mobile: user.mobile,
            role: user.role
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.mobile = user.mobile;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.mobile = token.mobile;
      session.user.role = token.role;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
