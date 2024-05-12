const createSEOUrl = text => {
  const { text } = props
  const url = props.text.toLowerCase().replace(/\s+/g, '-');
  const cleanUrl = url.replace(/[^a-z0-9-]/g, '');
  return cleanUrl;
}
export default createSEOUrl


