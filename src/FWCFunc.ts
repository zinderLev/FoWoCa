import { IWordCart } from './common';

export const wordCard:IWordCart[] = [];

let size = wordCard.length;
let currWord = getRandomInt(size);
let prevWord = currWord;
const quantResaltVariants = 5;
let rus;
let out = document.getElementById("out");
let ans = document.getElementById("ans");
let qLetters = 0;
let EnRu = 0;
let rnd = document.getElementById("Rnd");
let ru = document.getElementById("Ru");
let en = document.getElementById("En");
const selectedRadio = "#00ff00";
const unSelectedRadio = "#bbbbbb";

rnd!.style.background = selectedRadio;
ru!.style.background = unSelectedRadio;
en!.style.background = unSelectedRadio;

let onlyUnremembered = false;
let unrem = document.getElementById("Unrem");
let all = document.getElementById("All");
all!.style.background = selectedRadio;
unrem!.style.background = unSelectedRadio;

export function dictReload(){
  //wordCard = window.wordCard;
  size = wordCard.length;
  currWord = getRandomInt(size);
  prevWord = currWord;
  outputNextWord();
}

export function setEn(){
  EnRu = 1;
  rnd!.style.background = unSelectedRadio;
  ru!.style.background = unSelectedRadio;
  en!.style.background = selectedRadio;
}
export function setRu(){
  EnRu = 2;
  rnd!.style.background = unSelectedRadio;
  ru!.style.background = selectedRadio;
  en!.style.background = unSelectedRadio;
}
export function setRnd(){
  EnRu = 0;
  rnd!.style.background = selectedRadio;
  ru!.style.background = unSelectedRadio;
  en!.style.background = unSelectedRadio;
}

export function setRem(){
  onlyUnremembered = true;
  all!.style.background = unSelectedRadio;
  unrem!.style.background = selectedRadio;
}
export function resetRem(){
  onlyUnremembered = false;
  all!.style.background = selectedRadio;
  unrem!.style.background = unSelectedRadio;
}

outputNextWord();

export function outputRandWord() {
  if(size == 0) return;
  currWord = getAnotherRandomInt(size, prevWord);
  if(onlyUnremembered && wordCard[currWord].rem){
    let i = 0;
    for(; i < size; i++){
      currWord++;
      if(currWord >= size) currWord = 0;
      if((!wordCard[currWord].rem) && (currWord != prevWord)) break;
    }
    if(i >= size){
      out!.innerHTML = "Yor remember all the words!";
      return;
    }
  }
  outputWord();
}

export function outputNextWord() {
  if(size == 0) return;
  currWord++;
  if(currWord >= size) currWord = 0;
  if(onlyUnremembered && wordCard[currWord].rem){
    let i = 0;
    for(; i < size; i++){
      currWord++;
      if(currWord >= size) currWord = 0;
      if(!wordCard[currWord].rem) break;
    }
    if(i >= size){
      out!.innerHTML = "Yor remember all the words!";
      return;
    }
  }
  outputWord();
}

export function outputPrevWord() {
  if(size == 0) return;
  currWord--;
  if(currWord < 0 ) currWord = size - 1;
  if(onlyUnremembered && wordCard[currWord].rem){
    let i = 0;
    for(; i < size; i++){
      currWord--;
      if(currWord < 0 ) currWord = size - 1;
      if(!wordCard[currWord].rem) break;
    }
    if(i >= size){
      out!.innerHTML = "Yor remember all the words!";
      return;
    }
  }
  outputWord();
}
const iRemember = " <sup style='color:green; font-weight: bolder; font-size: 24pt;'>(M)</sup>";//"<span style='' "

export function wordRemembered() {
  if(size == 0) return;
  wordCard[currWord].rem = true;    
  out!.innerHTML +=  iRemember;
}

export function wordForgot() {
  if(size == 0) return;
  wordCard[currWord].rem = false;    
  if (rus) {
    out!.innerHTML = wordCard[currWord].t;
  } else {
    out!.innerHTML = wordCard[currWord].w;
  }
}

export function outputWord() {
  if(size == 0) return;
  qLetters = 0;
  ans!.innerHTML = "&nbsp;";
  prevWord = currWord;
  rus = (!EnRu)? Math.random() > 0.6 : (EnRu == 1)? false : true;
  if (rus) {
    out!.innerHTML = wordCard[currWord].t + (wordCard[currWord].rem? iRemember : "" );
  } else {
    out!.innerHTML = wordCard[currWord].w + (wordCard[currWord].rem? iRemember : "" );
  }
}

export function outputVariants() {
  if(size == 0) return;
  let varArr = [currWord];
  let qVars = Math.min(quantResaltVariants, size);
  for (let i = 0; i < qVars - 1; i++) {
    getRandomIntArray(size - 1, varArr);
  }

  let rightAnswer = getAnotherRandomInt(qVars - 1, 0);

  let tmp = varArr[rightAnswer];
  varArr[rightAnswer] = varArr[0];
  varArr[0] = tmp;

  let answers = rus ? wordCard[varArr[0]].w : wordCard[varArr[0]].t;
  for (let i = 1; i < qVars; i++) {
    answers += ", " + (rus ? wordCard[varArr[i]].w : wordCard[varArr[i]].t);
  }

  ans!.innerHTML = answers;
}

export function outputRightAnswer() {
  if(size == 0) return;
  if (rus) {
    ans!.innerHTML = wordCard[currWord].w;
  } else {
    ans!.innerHTML = wordCard[currWord].t;
  }
}

export function outputWordByChar() {
  if(size == 0) return;
  qLetters++;
  if (rus) {
    //let l = ans.innerHTML = wordCard[currWord].w.length;
    ans!.innerHTML = wordCard[currWord].w.substr(0, qLetters);
  } else {
    ans!.innerHTML = wordCard[currWord].t.substr(0, qLetters);
  }
}

export function getRandomInt(max) {
  return Math.round(Math.random() * max);
}

export function getRandomIntArray(max, randArr) {
  max = Math.min(max, size);
  let i = 0;
  let arrSize = randArr.length;
  let ret = Math.round(Math.random() * max);
  for (; i < 100 && randArr.includes(ret); i++) {
    ret = Math.round(Math.random() * max);
  }
  if (i < 100) {
    randArr[arrSize] = ret;
  }
}

export function getAnotherRandomInt(max, prevRand) {
  let ret = Math.round(Math.random() * max);
  for (let i = 0; i < 100 && prevRand == ret; i++) {
    ret = Math.round(Math.random() * max);
  }
  return ret;
}

