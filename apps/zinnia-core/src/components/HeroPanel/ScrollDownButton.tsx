import { UnstyledButton } from '@mantine/core';
import classes from './ScrollDownButton.module.css';
import { startRef } from '@/refs/startRef';

export function ScrollDownButton() {
  const handleButton = () => {
    startRef.current?.scrollIntoView();
  };

  return <UnstyledButton onClick={handleButton} className={classes.button} />;
}
