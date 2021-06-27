// processors
export const flattenIndent = prop => {
  return prop.replace(/(?<=\n)[^\n]\s+/g, '');
}
