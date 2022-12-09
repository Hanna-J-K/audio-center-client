/* eslint-disable quotes */
import {
  createStyles,
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  Anchor,
} from "@mantine/core";
import {
  IconPlaylist,
  IconHeadphones,
  IconRadio,
  IconBroadcast,
} from "@tabler/icons";
import Link from "next/link";

const mockdata = [
  {
    title: "Queue",
    description:
      "Here you can listen to music and manage your queue! You can search for available song via title or artist.",
    icon: IconPlaylist,
    link: "/queue",
  },
  {
    title: "Library",
    description:
      "Save songs from queue directly to your library. That way you'll never lose track of your favourite tracks!",
    icon: IconHeadphones,
    link: "/library",
  },
  {
    title: "Radio",
    description:
      "A collection of online radio stations you can listen to. If you have an MP3 link to a radio station, you can also add it to your custom radio stations.",
    icon: IconRadio,
    link: "/radio",
  },
  {
    title: "Broadcast",
    description:
      "Have something to talk about? Start a live broadcasting session that other users can listen to. You can also join an active live session hosted by another user.",
    icon: IconBroadcast,
    link: "/broadcast",
  },
];

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 34,
    fontWeight: 900,
    [theme.fn.smallerThan("sm")]: {
      fontSize: 24,
    },
    color: theme.colors.sandyBrown[0],
  },

  description: {
    maxWidth: 600,
    margin: "auto",

    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: 45,
      height: 2,
      marginTop: theme.spacing.sm,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },

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
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: 45,
      height: 2,
      marginTop: theme.spacing.sm,
    },
    "&::hover": {
      color: theme.colors.sandyBrown[0],
      textDecoration: "none",
    },
    color: theme.colors.persianGreen[0],
    fontSize: theme.fontSizes.xl,
    fontWeight: 700,
  },
  cardDescription: {
    color: theme.colors.sandyBrown[2],
    fontWeight: 600,
  },
}));

export function QuickStartFeatures() {
  const { classes, theme } = useStyles();
  const features = mockdata.map((feature) => (
    <Card
      key={feature.title}
      shadow="md"
      radius="md"
      className={classes.card}
      p="xl"
    >
      <feature.icon size={50} stroke={2} color="#f4a261" />
      <Link href={feature.link} passHref className={classes.cardTitle}>
        <Anchor component="a">
          <Text size="lg" weight={600} className={classes.cardTitle} mt="md">
            {feature.title}
          </Text>
        </Anchor>
      </Link>

      <Text size="md" mt="sm" className={classes.cardDescription}>
        {feature.description}
      </Text>
    </Card>
  ));
  return (
    <Container mt="xl">
      <Title order={2} className={classes.title} align="center" mt="xl">
        Audio Center quickstart overview
      </Title>

      <Text align="center" mt="md">
        Check out the features that make Audio Center the best choice for
        streaming audio on the web and how to use them!
      </Text>

      <SimpleGrid
        cols={2}
        spacing="xl"
        mt={50}
        breakpoints={[{ maxWidth: "md", cols: 1 }]}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}
