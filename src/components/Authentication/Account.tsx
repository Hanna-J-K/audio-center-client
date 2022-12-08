import {
  useUser,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import {
  Card,
  Text,
  Button,
  Group,
  Avatar,
  createStyles,
  Stack,
} from "@mantine/core";
import { IconUser } from "@tabler/icons";
import { QuickStartFeatures } from "../Layout/QuickStartFeatures";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.charcoal[4],
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.persianGreen[0],
    borderColor: theme.colors.sandyBrown[0],
    borderRadius: theme.radius.lg,
    borderWidth: 3,
    fontWeight: 700,
    margin: "auto",
  },
  cardTitle: {
    padding: theme.spacing.xl,
    fontSize: theme.fontSizes.xl,
  },
  button: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[5]
        : theme.colors.sandyBrown[0],
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.persianGreen[6]
        : theme.colors.persianGreen[3],
    borderRadius: theme.radius.lg,
    "&:hover": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.sandyBrown[4]
          : theme.colors.sandyBrown[0],
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.charcoal[8]
          : theme.colors.persianGreen[5],
      border: "none",
    },
    minWidth: "15%",
    margin: theme.spacing.xs,
    marginTop: theme.spacing.xl,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  icon: {
    backgroundColor: theme.colors.persianGreen[0],
    color: theme.colors.sandyBrown[0],
    borderColor: theme.colors.persianGreen[0],
  },
  label: {
    paddingLeft: theme.spacing.sm,
    color: theme.colors.sandyBrown[0],
    fontSize: theme.fontSizes.lg,
  },
}));

export default function Account({ session }: { session: Session }) {
  const supabase = useSupabaseClient();
  const { classes } = useStyles();

  return (
    <Stack>
      <Card className={classes.card} withBorder>
        <Card.Section>
          <Group position="left" className={classes.cardTitle}>
            <Avatar
              radius="lg"
              size={64}
              styles={{
                root: { backgroundColor: "#2a9d8f" },
                placeholder: { backgroundColor: "#2a9d8f" },
              }}
            >
              <IconUser size={48} className={classes.icon} />
            </Avatar>
            <Text weight={700}> Your Account</Text>
          </Group>
        </Card.Section>
        <Stack>
          <Group>
            <Text className={classes.label}>Email:</Text>
            {" " + session.user.email}
          </Group>
          <Group>
            <Text className={classes.label}>User ID:</Text>
            {" " + session.user.id}
          </Group>
        </Stack>
        <Group position="right">
          <Button
            type="button"
            className={classes.button}
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </Button>
        </Group>
      </Card>
      <QuickStartFeatures />
    </Stack>
  );
}
