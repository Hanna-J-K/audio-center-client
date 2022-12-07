import React from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "../src/components/Authentication/Account";
import { Center, Stack } from "@mantine/core";
import { WelcomeBanner } from "../src/components/Layout/WelcomeBanner";

export default function IndexPage() {
  const session = useSession();

  const supabase = useSupabaseClient();
  return (
    <Center>
      <Stack>
        <WelcomeBanner />
        <div className="container" style={{ padding: "50px 0 100px 0" }}>
          {!session ? (
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
            />
          ) : (
            <Account session={session} />
          )}
        </div>
      </Stack>
    </Center>
  );
}
