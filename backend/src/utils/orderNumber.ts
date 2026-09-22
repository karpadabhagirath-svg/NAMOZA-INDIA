/** Generates a human-friendly, sortable order number like NMZ-20260922-4821. */
export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 digits
  return `NMZ-${datePart}-${randomPart}`;
}
