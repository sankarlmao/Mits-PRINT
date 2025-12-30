export async function formatDate(dateInput) {
  const date = new Date(dateInput);

  return date.toLocaleString("en-IN", {
    weekday:"long",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "numeric",
    
    hour12: true,
  });
}