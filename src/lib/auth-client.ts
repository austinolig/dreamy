import { createAuthClient } from "better-auth/react";
import { oneTapClient } from "better-auth/client/plugins";

/* Better Auth client instance */
export const authClient = createAuthClient({
  plugins: [
    oneTapClient({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      cancelOnTapOutside: false,
    }),
  ],
});
