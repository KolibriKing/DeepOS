/*
 * Copyright 2023 KolibriKing
 */

export function String$ToSpace(string) {
  let result = '';
  for (let char of string) {
    if (char != ' ') {
      result += char;
    } else {
      break;
    }
  }
  return result;
}

export function String$FromPos(string, pos) {
  let result = '';
  for (let i = pos; i < string.length; i++) {
    result += string[i];
  }
  return result;
}
export function String$ToSpaceArray(string) {
  let result = [];
  let laststr = '';
  let i = 0;
  for (let char of string) {
    if (char != ' ') {
      laststr += char;
      if (i == string.length - 1) {
        result.push(laststr);
        laststr = '';
      }
    } else {
      result.push(laststr);
      laststr = '';
    }
    i++;
  }
  return result;
}
export function String$countChar(cchar, string) {
  let result = 0;
  for (let char of string) {
    if (char == cchar) {
      result++;
    }
  }
  return result;
}
