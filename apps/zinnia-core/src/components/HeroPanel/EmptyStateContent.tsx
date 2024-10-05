import { Flex, Loader } from '@mantine/core';

export function EmptyStateContent() {
  return (
    <Flex justify="center" align="center">
      <Loader color="blue" size="lg" />
    </Flex>
  );
}
