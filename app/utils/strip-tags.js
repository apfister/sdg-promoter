export default function stripTags(inStr) {
  return inStr.replace(/<(?:.|\n)*?>/gm, '');
}
