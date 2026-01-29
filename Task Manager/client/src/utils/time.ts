// client/src/utils/time.ts
export const formatDateWithRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  let relative = "just now";

  if (diffSeconds < 60) {
    relative = `${diffSeconds} seconds ago`;
  } else if (diffMinutes < 60) {
    relative = `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    relative = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else {
    relative = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  // ✅ Force 12-hour format with AM/PM
  const formattedDate = date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  return `${formattedDate} (${relative})`;
};
