function getYear(y) { return (y < 1000) ? y + 1900 : y; }

function isDate(year, m, day) {
  const month = m - 1; // 0-11 in JavaScript
  const tmpDate = new Date(year, month, day);
  if ((getYear(tmpDate.getYear()) === parseInt(year, 10)) && (parseInt(month, 10) === tmpDate.getMonth()) && (parseInt(day, 10) === tmpDate.getDate())) {
    return true;
  }
  return false;
}
export default function validatePNum(sPNum) {
  const numbers = sPNum.match(/^(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)$/);
  let checkSum = 0;

  if (!isDate(sPNum.substring(0, 4), sPNum.substring(4, 6), sPNum.substring(6, 8))) {
    return false;
  }
  if (numbers === null) { return false; }

  let n;
  for (let i = 3; i <= 12; i += 1) {
    n = parseInt(numbers[i], 10);
    if (i % 2 === 0) {
      checkSum += n;
    } else {
      checkSum += ((n * 2) % 9) + (Math.floor(n / 9) * 9);
    }
  }

  if (checkSum % 10 === 0) { return true; }
  return false;
}
