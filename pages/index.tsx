import React from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "../src/components/Authentication/Account";
import { Center, Group, Stack } from "@mantine/core";
import { WelcomeBanner } from "../src/components/Layout/WelcomeBanner";
import { QuickStartFeatures } from "../src/components/Layout/QuickStartFeatures";

export default function IndexPage() {
  const session = useSession();

  const supabase = useSupabaseClient();
  return (
    <Center>
      <Stack>
        <div className="container" style={{ padding: "50px 0 100px 0" }}>
          {!session ? (
            <>
              <WelcomeBanner />
              <Auth
                supabaseClient={supabase}
                theme="dark"
                appearance={{
                  theme: ThemeSupa,
                }}
              />
            </>
          ) : (
            <Account session={session} />
          )}
        </div>
      </Stack>
    </Center>
  );
}
