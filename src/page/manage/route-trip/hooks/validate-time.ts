export default function validateTimeFormat(value: string) {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  if (!timeRegex.test(value)) {
    return "Invalid time format (HH:MM:SS)";
  }
  const [hours, minutes, seconds] = value.split(":").map(Number);
  if (hours > 23 || minutes > 59 || seconds > 59) {
    return "Invalid time values";
  }
  return null;
}
