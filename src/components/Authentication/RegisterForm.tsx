import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { IconEyeOff, IconEyeCheck } from "@tabler/icons";
import Link from "next/link";
import { useState } from "react";
import { axiosApi } from "../Context/AudioPlayerContext";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export function RegisterForm() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const session = useSession();

  const supabase = useSupabaseClient();

  async function handleRegister(
    username: string,
    email: string,
    password: string,
  ) {
    // await axiosApi
    //   .post("/register", {
    //     username: username,
    //     email: email,
    //     password: password,
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });
  }
  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Link href="/login" passHref>
          <Anchor component="a">Sign in</Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Username"
          value={userName}
          onChange={(event) => setUserName(event.currentTarget.value)}
          required
        />
        <TextInput
          label="Email"
          value={userEmail}
          onChange={(event) => setUserEmail(event.currentTarget.value)}
          required
        />
        <PasswordInput
          label="Password"
          value={userPassword}
          onChange={(event) => setUserPassword(event.currentTarget.value)}
          visibilityToggleIcon={({ reveal, size }) =>
            reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
          }
          required
          mt="md"
        />
        <Group position="apart" mt="lg">
          <Checkbox label="Remember me" sx={{ lineHeight: 1 }} />
        </Group>
        <Button
          type="submit"
          fullWidth
          mt="xl"
          onClick={() => handleRegister(userName, userEmail, userPassword)}
        >
          Register
        </Button>
      </Paper>
    </Container>
  );
}
