import { createAuthClient } from "better-auth/react";
import { oneTapClient } from "better-auth/client/plugins";

if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
}

export const authClient = createAuthClient({
  plugins: [
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      cancelOnTapOutside: false,
    }),
  ],
});
