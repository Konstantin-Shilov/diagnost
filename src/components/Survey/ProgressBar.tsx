import React from "react";

import { Text } from "@/components/Typography";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  progress: number;
  currentBlock: string;
  totalBlocks: number;
  currentBlockIndex: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  currentBlock,
  totalBlocks,
  currentBlockIndex,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text size="sm" variant="tertiary" as="span" className={styles.blockInfo}>
          Блок {currentBlockIndex + 1} из {totalBlocks}: {currentBlock}
        </Text>
        <Text size="sm" semantic="accent" as="span" className={styles.progressText}>
          {progress}%
        </Text>
      </div>

      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
