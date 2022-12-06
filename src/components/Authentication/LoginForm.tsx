import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { axiosApi } from "../AudioPlayerContext";

async function handleLogin(email: string, password: string) {
  await axiosApi
    .post("/login", {
      email: email,
      password: password,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function LoginForm() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  return (
    <Container size={420} my={40}>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Link href="/register" passHref>
          <Anchor component="a">Create account</Anchor>
        </Link>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
          onClick={() => handleLogin(userEmail, userPassword)}
        >
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
