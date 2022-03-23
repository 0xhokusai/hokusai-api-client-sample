// this method return the right units for file size
// input 127 => output 127 bytes...
export default function niceBytes(fileSize: number): string {
  const units: string[] = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB',
    'EB',
    'ZB',
    'YB',
  ];
  let l = 0;
  let sizeNumber = fileSize || 0;
  // eslint-disable-next-line no-plusplus
  while (sizeNumber >= 1024 && ++l) {
    sizeNumber /= 1024;
  }
  return `${sizeNumber.toFixed(sizeNumber < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}
