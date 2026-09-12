/** Converts an array of flat objects into a CSV string and triggers a
 *  browser download. Kept dependency-free since the data shapes here are
 *  simple flat records — swap for a library if nested/complex data shows
 *  up later. */
export function downloadCsv(filename: string, rows: Record<string, any>[]) {
  if (!rows.length) return;

  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );

  const escape = (value: any) => {
    if (value === null || value === undefined) return '';
    const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
