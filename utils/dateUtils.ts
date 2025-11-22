export function parseFlexibleDate(input: string): string {
  if (!input || !input.trim()) {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }

  const normalized = input.trim().replace(/\./g, '-').replace(/\//g, '-');
  const parts = normalized.split('-');

  if (parts.length === 3) {
    // If year is 2 digits, assume 20xx
    if (parts[2].length === 2) {
      parts[2] = '20' + parts[2];
    }

    // If year is first (YYYY-MM-DD), return as is
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(
        2,
        '0'
      )}`;
    }

    // If year is last (DD-MM-YY or DD-MM-YYYY)
    if (parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(
        2,
        '0'
      )}`;
    }
  }

  // Fallback: try native Date
  const d = new Date(input);
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }

  // Last resort: return today
  return new Date().toISOString().slice(0, 10);
}

export function matchesDateFilter(todoDate: Date, filter: string): boolean {
  const now = new Date();

  if (filter === 'today') {
    return (
      todoDate.getFullYear() === now.getFullYear() &&
      todoDate.getMonth() === now.getMonth() &&
      todoDate.getDate() === now.getDate()
    );
  }

  const filterDays: Record<string, number> = {
    '5days': 5,
    '10days': 10,
    '30days': 30,
  };

  const days = filterDays[filter];
  if (days) {
    const diff = (todoDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= days;
  }

  return false;
}
