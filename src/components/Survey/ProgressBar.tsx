import React from "react";

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
    <div style={{ marginBottom: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontSize: "14px", color: "#666" }}>
          Блок {currentBlockIndex + 1} из {totalBlocks}: {currentBlock}
        </span>
        <span style={{ fontSize: "14px", fontWeight: "bold", color: "#007bff" }}>{progress}%</span>
      </div>

      <div
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: "#e9ecef",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#007bff",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};
