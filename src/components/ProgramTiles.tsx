import {
  Container,
  createStyles,
  Grid,
  SimpleGrid,
  Skeleton,
  Title,
  useMantineTheme,
} from "@mantine/core";
import React from "react";

const PRIMARY_COL_HEIGHT = 300;

const useStyles = createStyles((theme) => ({
  tile: {
    border: `5px solid ${
      theme.colorScheme === "dark"
        ? theme.colors.charcoal[6]
        : theme.colors.charcoal[4]
    }`,
  },

  grid: {
    marginTop: "5%",
  },
}));

export function ProgramTiles() {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;
  return (
    <Container my="md">
      <Title className={classes.grid} order={2}>
        Recommended channels
      </Title>
      <SimpleGrid
        cols={2}
        spacing="md"
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
      >
        <Skeleton
          height={PRIMARY_COL_HEIGHT}
          radius="md"
          animate={false}
          className={classes.tile}
        />
        <Grid gutter="md">
          <Grid.Col>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius="md"
              animate={false}
              className={classes.tile}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius="md"
              animate={false}
              className={classes.tile}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius="md"
              animate={false}
              className={classes.tile}
            />
          </Grid.Col>
        </Grid>
      </SimpleGrid>
    </Container>
  );
}
