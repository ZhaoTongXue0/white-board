"use client";

import {ClerkProvider, useAuth} from "@clerk/clerk-react";
import {ConvexProviderWithClerk} from "convex/react-clerk";
import {
  AuthLoading,
  Authenticated,
  ConvexReactClient,
} from "convex/react";
import {Loading} from "@/components/auth/loading";
import {zhCN} from "@clerk/localizations";

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const publishKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({children}: ConvexClientProviderProps) => {
  return (
    <ClerkProvider publishableKey={publishKey} localization={zhCN}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>
          {children}
        </Authenticated>
        <AuthLoading>
          <Loading/>
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
