export const parseRange = (rangeHeader, fileSize) => {
  // No Range header at all -> Serve whole file
  if (!rangeHeader) {
    return { type: 'full' }
  }

  // Only "bytes" unit is defined by spec
  if (typeof rangeHeader !== 'string' && !rangeHeader.startsWith('bytes=')) {
    return { type: 'full' }
  }

  // Strip the unit prefix. Everything left should be a single range
  const spec = rangeHeader.slice('bytes='.length).trim();

  // Treat multi-range as invalid and serve the whole file
  if (spec.includes(',')) {
    return { type: 'full' }
  }

  // Match "<start>-<end>", "<start>-", or "-<suffix>"
  const match = /^(\d*)-(\d*)$/.exec(spec);
  if (!match) {
    return { type: 'full' }
  }

  const [, startStr, endStr] = match;

  // Both sides missing: "bytes-" is invalid
  if (startStr === '' && endStr === '') {
    return { type: 'full' }
  }

  let start;
  let end;

  if (startStr === '') {
    // Suffix form: "bytes=-500" -> last bytes.
    const suffixLength = Number(endStr);
    if (suffixLength === 0) return { type: 'unsatisfiable' }
    start = Math.max(0, fileSize - suffixLength);
    end = fileSize - 1;
  } else {
    start = Number(startStr);
    end = endStr === '' ? fileSize - 1 : Number(endStr);

    // Validate the range
    if (start >= fileSize || start > end) {
      return { type: 'unsatisfiable' }
    }

    if (end >= fileSize) {
      end = fileSize - 1;
    }
  }
  
  return { type: 'partial', start, end }
}