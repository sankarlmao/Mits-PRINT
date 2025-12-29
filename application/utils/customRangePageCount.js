function isValidCustomRange(customValue, pageCount) {
  if (!customValue) return false;

  // Allow single page: "5"
  if (/^\d+$/.test(customValue)) {
    const page = Number(customValue);
    return page >= 1 && page <= pageCount;
  }

  // Allow range: "2-10"
  if (/^\d+-\d+$/.test(customValue)) {
    const [start, end] = customValue.split("-").map(Number);
    return (
      start >= 1 &&
      end >= 1 &&
      start <= end &&
      end <= pageCount
    );
  }

  return false;
}