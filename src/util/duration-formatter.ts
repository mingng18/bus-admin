export default function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  var str = minutes === 0 ? "" : `${minutes}m`;
  str += seconds === 0 ? "" : ` ${seconds}s`;
  return str;
}
