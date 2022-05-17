
export function getInitials(fullname: string) {
  const arr = fullname.split(' ');
  arr.splice(1, arr.length - 2);
  return arr.map(n => n[0]).join('');
}
