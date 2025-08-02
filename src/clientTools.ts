import { ServerResponse, IMapsOfAny, IDict, IApiStruct} from './common';
import { setRnd, setEn, setRu, setRem, resetRem, outputPrevWord, outputRandWord,
    outputNextWord, wordRemembered, wordForgot, outputVariants, outputWordByChar, outputRightAnswer, 
} from './FWCFunc';
/*
BindButton('outputVariants', outputVariants, []); // id отсутствует, используем имя функции
BindButton('outputWordByChar',  []); // id отсутствует, используем имя функции
BindButton('outputRightAnswer', []); // id отсутствует, используем имя функции
*/

export async function ApiRequest(data:string):Promise<ServerResponse>{
    try{
        const response = await fetch('/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const jsonResp  = await response.json() as ServerResponse;

        if (response.ok) {
            if(jsonResp.error){
                throw jsonResp.error;
            }
            return jsonResp;        
        } else {
            throw JSON.stringify(jsonResp);
        }
    } catch (err) {
        throw err;
    }
}

class TLocaleData {
    currUser:string = "";
    token:string = "";
    i_agree_cookie:boolean = false;
}

export const oLocaleData = new TLocaleData();


async function signIn(){
    try{
        const login = (document.getElementById("login") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;

        if(!password || !login){
            return;
        }

        const oData:IApiStruct = {command:"signIn", data:{sUser: login, sPassword: password}}
        const oAnswer = await ApiRequest(JSON.stringify(oData));

        if(oAnswer && oAnswer.result && oAnswer.result.token){
            oLocaleData.token = oAnswer.result.token;
        } else {
            oLocaleData.token = "";
            throw "Wrong login or password"
        }

        oLocaleData.currUser = login;
        localStorage.setItem("oLocaleData", JSON.stringify(oLocaleData));

        alert("Saccess!");
    }catch (err:any){
        alert("Error: " + JSON.stringify(err));
    }
}

async function signUp(){
    openBlock('repPassDiv');
    try{
        const login = (document.getElementById("login") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;
        const repPassword = (document.getElementById("repPassword") as HTMLInputElement).value;

        if(!password || !repPassword || !login){
            return;
        }

        if(password  != repPassword){
            alert("The password and the repetition of the password are not equal");
            return
        }

        const oData:IApiStruct = {command:"newUser", data:{sUser: login, sPassword: password}}
        const oAnswer = await ApiRequest(JSON.stringify(oData));
        if(oAnswer && oAnswer.result && oAnswer.result.token){
            oLocaleData.token = oAnswer.result.token;
            oLocaleData.currUser = login;
            localStorage.setItem("oLocaleData", JSON.stringify(oLocaleData));
        } else {
            throw "Wrong login or password"
        }

        alert("Saccess!");
    }catch (err:any){
        alert("Error: " + JSON.stringify(err));
    }
}

function logout(){
    oLocaleData.currUser = "";
    oLocaleData.token = "";
    localStorage.setItem("oLocaleData", JSON.stringify(oLocaleData));
}

async function LoadDict(){
    try{
        const oData:IApiStruct = {command:"dictLoad", data:{sUser: oLocaleData.currUser, token: "1764", }}
        const oAnswer = await ApiRequest(JSON.stringify(oData));
        alert("Saccess: " + JSON.stringify(oAnswer));
    }catch (err:any){
        alert("Error: " + JSON.stringify(err));
    }
}

async function GetDict(){
    try{
        const oData:IApiStruct = {command:"dictRequest", data:{sUser: oLocaleData.currUser, token: "1764", }}
        const oAnswer = await ApiRequest(JSON.stringify(oData));
        alert("Saccess: " + JSON.stringify(oAnswer));
    }catch (err:any){
        alert("Error: " + JSON.stringify(err));
    }
}

async function CheckFileExist(){
    try{
        const oData = {command:"CheckDictExist", data:{sUser: "lev", sPassword: "1764"}}
        const oAnswer = await ApiRequest(JSON.stringify(oData));
        alert("Saccess: " + JSON.stringify(oAnswer));
    }catch (err:any){
        alert("Error: " + JSON.stringify(err));
    }
}

function getCookie(cookie_name: string)
{
  let results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

  if ( results ){
    return results[2];
  }  else {
    return "";
  }
}
export function SetSameObjFields(src:IMapsOfAny, dst:IMapsOfAny){
    for(const key of Object.keys(src)){
        if(key in dst){
           dst[key] = src[key]
        }
    }
}
function SetObjFieldsFromAnotherObj(src:IMapsOfAny, dst:IMapsOfAny){
    for(const key of Object.keys(src)){
        dst[key] = src[key]
    }
}
function SetNotEmptyObjFieldsFromAnotherObj(src:IMapsOfAny, dst:IMapsOfAny){
    for(const key of Object.keys(src)){
        if(src[key]) {dst[key] = src[key]}
    }
}

export function IsObject(obj:unknown): obj is Record<string, any> {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

export function hideBlock(blokName:string){
    const dom = document.getElementById(blokName);
    if(dom){
        dom.style.display = "none";
    }
}

export function openBlock(blokName:string){
    const dom = document.getElementById(blokName);
    if(dom){
        dom.style.display = "";
    }
}

function LoadNewDictionary(){
    hideBlock('DictManipulationButtons');
    openBlock('DictLoad');
}
function AddWordsToDictionary(){
    hideBlock('DictManipulationButtons');
    openBlock('AddWords');
}
function CancelLoad(){
    hideBlock('DictLoad');
    hideBlock('AddWords');
    openBlock('DictManipulationButtons');
    document.getElementById("DictArr")!.innerHTML = "";
}
function ContinueWithoutAuthorization(){
    hideBlock('SignInBlock');
    openBlock('wordCardsBlock');
    (document.getElementById("login") as HTMLInputElement).value = "";
    (document.getElementById("password") as HTMLInputElement).value = "";
    (document.getElementById("repPassword") as HTMLInputElement).value = "";
}
function ChangeDictionary(){
    if(oLocaleData.currUser == "Stranger"){
        (document.querySelector("input[value='Change current dictionary']") as HTMLElement).style.display="none";
    }else{
        (document.querySelector("input[value='Change current dictionary']") as HTMLElement).style.display="inline-block";
    }
    hideBlock('wordCardsBlock');
    openBlock('DictManipulation');
}
function CancelDictManipulation(){
    hideBlock('DictManipulation');
    openBlock('wordCardsBlock');        
}
function iAgreeCookie(){
    hideBlock('cookieWarning');
    oLocaleData.i_agree_cookie = true;
    localStorage.setItem("oLocaleData", JSON.stringify(oLocaleData));
}      
function ChangeUser(){
hideBlock('wordCardsBlock');
openBlock('SignInBlock');       
if(oLocaleData.currUser == "Stranger"){
    hideBlock('logoutButton');
    openBlock('loginButton');       
}else{
    hideBlock('loginButton');
    openBlock('logoutButton');  
}
}    
function closeAlarm(){
hideBlock('waitingBox');
}

function closeInfo(){
hideBlock('waitingBox');
}

function setDict(){
  let data = (document.getElementById("textarea") as HTMLInputElement).value.trim();
  setData('replaceDict', data);
}

function setData(command, data){
  if(data == "") return;
	/*let funcSend = function() { //когда iframe загрузится - тогда и выполним запрос
		new_rcv.contentWindow.document.getElementById('value').value = data;//value 
		new_rcv.contentWindow.document.getElementById('command').value = command;//variable; 
		new_rcv.onload = funcRec;
		new_rcv.contentWindow.document.getElementById('form').submit();
	}	
	let funcRec = function() { //когда придёт ответ, тогда и обработаем его
		serverResponse = new_rcv.contentWindow.document.body.textContent;
		new_rcv.remove();
	}	
	let new_rcv     = document.createElement("iframe");
	new_rcv.src 	= "setDate.html";
	new_rcv.onload = funcSend;
	new_rcv.style.display = "none";
	document.body.append(new_rcv);*/
}

function showText(Pass, ShowPass){
  let pass = document.getElementById(Pass) as HTMLInputElement;
  if(pass.type == "password"){
    pass.type = "text";
    document.getElementById(ShowPass)!.innerHTML = "&#x1F441;";
  }else{
    pass.type = "password";
    document.getElementById(ShowPass)!.innerHTML = "&#128374;";        
  }
}


function BindButton(sName:string, f:Function, argList){
    const btn = document.getElementById(sName);
    if(btn){
        btn.addEventListener('click', () => {
            f(...argList);
        });
    }
}

let dictArr:IDict[] = [];
let currDict = "";

export function ChangeCurrDict(){
  if(oLocaleData.currUser == "Stranger"){
    return;
  }
  if(dictArr.length == 0){
    setData("ChangeDict", JSON.stringify({ log: oLocaleData.currUser}));
    //waiting();
  } else {
    openBlock("DictArr");
    showDictTableList();
  }
}

/*function BeforeLoadDict(){
  let dictName = (document.getElementById("dictName") as HTMLInputElement).value!.trim();
  CheckFileExist(dictName, "LoadDictionary");
}*/

function createDictTableShow(text){
  dictArr = JSON.parse(text);
  showDictTableList();
}

function showDictTableList(){
  let str = "";
  for(let i in dictArr){
    let isCurr = dictArr[i].dictName == currDict;
    let dictNameClass = isCurr? "currDictName" : "dictTableName";
    str += "<table id='dictTable"+ i +"' class='dictTable' onclick='selectDictTable(this.id)'><tbody>"+
              "<tr><th class='" + dictNameClass + "'>" + (isCurr ? "Current: " : "") + 
              dictArr[i].dictName + "</th></tr>"
    for(let j in dictArr[i].words){
      str += "<tr><td>" + 
        dictArr[i].words[j].w + " = " + dictArr[i].words[j].t + "</td></tr>";
    }
    str += "<tr><td>.........</td></tr>";
    str += "</tbody></table>";
  }
  
  document.getElementById("DictArr")!.innerHTML = str;
}

function selectDictTable(id){
  let n = +id.substr(9);
  let isCurr = dictArr[n].dictName == currDict;
  let dictNameClass = isCurr? "currDictName" : "dictTableName";
  let str = "<table id='dictTable"+ n +"' class='dictTable2' onclick='selectDictTable(this.id)'><tbody>"+
            "<tr><th class='" + dictNameClass + "'>" + (isCurr ? "Current: " : "") + 
            dictArr[n].dictName + "</th></tr>"
  //let str = "<table id='dictTable"+ n +"' class='dictTable2' onclick='selectDictTable(this.id)'><tbody>"+
  //            "<tr><th class='dictTableName'>" + window.dictArr[n].dictName + "</th></tr>";
  for(let j in dictArr[n].words){
    str += "<tr><td>" + 
      dictArr[n].words[j].w + " = " + dictArr[n].words[j].t + "</td></tr>";
  }
  str += "<tr><td>.........</td></tr>";
  str += "</tbody></table>";
  str +=  
    '<div>'+
          (isCurr ? '':
           '<input class="button1" type="button" value="Select this dictionary" onclick="SelectThisDict('+n+')"/>') +
          '<input class="button1" type="button" value="Get link" onclick="GetLinkToDikt('+ n +')" />'+
          '<input class="button1" type="button" value="Cancel" onclick="showDictTableList()" />'+
    '</div>'

  document.getElementById("DictArr")!.innerHTML = str;
}

function setAlarmEl(el){
  el.style.color = "red";
  el.style.borderColor = "red";
  el.style.border = "solid";
  el.style.boxShadow = "10px 10px 10px rgba(0, 0, 0, 5)";
}
function setNormalEl(el){
  el.style.color = "black";
  el.style.borderColor = "black";
  el.style.border = "";
  el.style.boxShadow = "";
  el.style.display="";
}

function Alarm(waitingBox, text, err){
  const okButton = "<br/><input class=\'button1\' type=\'button\' value=\'OK\' onclick=\'closeAlarm()\' " + 
             "style=\'box-shadow:5px 5px 6px rgba(0, 0, 0, 5);color:#FF0000; border:solid 2px #FF0000;float:right;\' />";
  setAlarmEl(waitingBox);
  if (typeof err === 'object' && !Array.isArray(err)){
    waitingBox.innerHTML = text + JSON.stringify(err) + okButton;
  }else{
    waitingBox.innerHTML = text + err + okButton;
  }
}

function Info(infoDesk, text){
  const okButton = "<br/><input class=\'button1\' type=\'button\' value=\'OK\' onclick=\'closeInfo()\' " + 
             "style=\'box-shadow:5px 5px 6px rgba(0, 0, 0, 5);color:#000000; border:solid 2px #000000;float:right;\'/>";
  setNormalEl(infoDesk);
  infoDesk.innerHTML = text + okButton;
}

function GetLinkToDikt(n){
  let str = "https://fowoca.glitch.me/t" + oLocaleData.currUser + ":" + dictArr[n].dictName;
  navigator.clipboard.writeText(str)
  .then(() => {
    Info(document.getElementById("waitingBox"), "The link to this dictionary \"" + str + "\" has been copied to the clipboard.");
  })
  .catch(err => {
    Alarm(document.getElementById("waitingBox"), "Something went wrong", err)
    //console.log('Something went wrong', err);
  });
}

BindButton("iAgreeCookie", iAgreeCookie, []);
BindButton('ChangeUser', ChangeUser, []);
BindButton('showTextPassword', showText, ['password', 'showTextPassword']);
BindButton('showTextRepPass', showText, ['repPassword', 'showTextRepPass']);
BindButton('signIn', signIn, []); // id отсутствует, используем имя функции
BindButton('signUp', signUp, []); // id отсутствует, используем имя функции
BindButton('ContinueWithoutAuthorization', ContinueWithoutAuthorization, []); // id отсутствует, используем имя функции
BindButton('logout', logout, []); // id отсутствует, используем имя функции
BindButton('signIn_1', signIn, []); // id отсутствует, используем имя функции
BindButton('signUp_1', signUp, []); // id отсутствует, используем имя функции
BindButton('ContinueWithoutAuthorization_1', ContinueWithoutAuthorization, []); // id отсутствует, используем имя функции
BindButton('setRnd', setRnd, []); // id отсутствует, используем имя функции
BindButton('Rnd', setRnd, []);
BindButton('setEn', setEn, []); // id отсутствует, используем имя функции
BindButton('En', setEn, []);
BindButton('setRu', setRu, []); // id отсутствует, используем имя функции
BindButton('Ru', setRu, []);
BindButton('resetRem', resetRem, []); // id отсутствует, используем имя функции
BindButton('All', resetRem, []);
BindButton('setRem', setRem, []); // id отсутствует, используем имя функции
BindButton('Unrem', setRem, []);
BindButton('outputPrevWord', outputPrevWord, []); // id отсутствует, используем имя функции
BindButton('outputRandWord', outputRandWord, []); // id отсутствует, используем имя функции
BindButton('outputNextWord', outputNextWord, []); // id отсутствует, используем имя функции
BindButton('wordRemembered', wordRemembered, []); // id отсутствует, используем имя функции
BindButton('wordForgot', wordForgot, []); // id отсутствует, используем имя функции
BindButton('outputVariants', outputVariants, []); // id отсутствует, используем имя функции
BindButton('outputWordByChar', outputWordByChar, []); // id отсутствует, используем имя функции
BindButton('outputRightAnswer', outputRightAnswer, []); // id отсутствует, используем имя функции
BindButton('ChangeDictionary', ChangeDictionary, []); // id отсутствует, используем имя функции
BindButton('LoadNewDictionary', LoadNewDictionary, []); // id отсутствует, используем имя функции
BindButton('ChangeCurrDict', ChangeCurrDict, []); // id отсутствует, используем имя функции
BindButton('CancelDictManipulation', CancelDictManipulation, []); // id отсутствует, используем имя функции
BindButton('LoadDict', LoadDict, []); // id отсутствует, используем имя функции
BindButton('CancelLoad', CancelLoad, []); // id отсутствует, используем имя функции
BindButton('opebBlock', openBlock, ['DictLoad']); // id отсутствует, используем имя функции
BindButton('CancelLoad_1', CancelLoad, []); // id отсутствует, используем имя функции

/*document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm') as HTMLFormElement;
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    if (registrationForm && usernameInput && passwordInput) {
        registrationForm.addEventListener('submit', async (event: Event) => {
            event.preventDefault(); // Предотвращаем стандартную отправку формы

            const username = usernameInput.value;
            const password = passwordInput.value;

            if (!username || !password) {
                alert('Пожалуйста, введите имя пользователя и пароль.');
                return;
            }

            const userData: UserRegistrationData = { username, password };

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const result: ServerResponse = await response.json();

                if (response.ok) { // Статус 2xx
                    alert(`Успех: ${result.message}`);
                    // Очистить поля формы после успешной регистрации
                    usernameInput.value = '';
                    passwordInput.value = '';
                } else { // Статус 4xx, 5xx
                    alert(`Ошибка: ${result.message}`);
                }
            } catch (error) {
                console.error('Ошибка при отправке запроса:', error);
                alert('Произошла ошибка сети или сервера. Попробуйте еще раз.');
            }
        });
    } else {
        console.error('Не удалось найти необходимые элементы формы в DOM.');
    }
});*/
