import { ServerResponse, IMapsOfAny} from './common';

export async function ApiRequest(data:string):Promise< string | undefined >{
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
            return jsonResp.resalt;        
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
        const oData = {command:"SignIn", data:{sUser: "lev", sPassword: "1764"}}
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
