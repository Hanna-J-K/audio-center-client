import React from "react";
import { SimpleGrid, Title, Center, ThemeIcon, Stack } from "@mantine/core";
import { IconRadio } from "@tabler/icons";
const RadioPlayer = () => {
  return (
    <>
      <Title>Radio Stations</Title>
      <SimpleGrid cols={2}>
        <Stack>
          <Center>
            <ThemeIcon
              size={60}
              variant="gradient"
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
            >
              <IconRadio size={50} />
            </ThemeIcon>
          </Center>
          <Title>PlaybackFM</Title>
        </Stack>
        <Stack>
          <Center>
            <ThemeIcon
              size={60}
              variant="gradient"
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
            >
              <IconRadio size={50} />
            </ThemeIcon>
          </Center>
          <Title>K-DST</Title>
        </Stack>
        <Stack>
          <Center>
            <ThemeIcon
              size={60}
              variant="gradient"
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
            >
              <IconRadio size={50} />
            </ThemeIcon>
          </Center>
          <Title>Vinewood Boulevard Radio</Title>
        </Stack>
        <Stack>
          <Center>
            <ThemeIcon
              size={60}
              variant="gradient"
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
            >
              <IconRadio size={50} />
            </ThemeIcon>
          </Center>
          <Title>Liberty Rock Radio</Title>
        </Stack>
      </SimpleGrid>
    </>
  );
};

export default RadioPlayer;
