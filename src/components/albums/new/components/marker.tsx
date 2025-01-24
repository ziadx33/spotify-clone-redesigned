type MarkerProps = {
  position: number;
  onMouseDown: () => void;
  isStart: boolean;
  fileDuration: number;
};

export function Marker({
  position,
  onMouseDown,
  isStart,
  fileDuration,
}: MarkerProps) {
  return (
    <div
      className={`absolute top-0 z-20 h-full w-2 cursor-pointer ${isStart ? "rounded-l-md" : "rounded-r-md"} bg-secondary-foreground`}
      style={{
        left: `${(position / fileDuration) * 100}%`,
        transform: "translateX(-50%)",
      }}
      onMouseDown={onMouseDown}
    ></div>
  );
}
