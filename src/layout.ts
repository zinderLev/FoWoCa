import { IApiStruct, IDict, } from './common';
import { hideBlock, IsObject, SetSameObjFields, ApiRequest, openBlock, oLocaleData} from './clientTools';

hideBlock('waitingBox');
const width = window.screen.width
const height = window.screen.height;
    
{
    const tmp = localStorage.getItem("oLocaleData");
    if(tmp){
        try{
            const tmp2 = JSON.parse(tmp);
            if(tmp2 && IsObject(tmp2)){
                SetSameObjFields(tmp2, oLocaleData);
            }
        }catch{}
    }
    localStorage.setItem("oLocaleData", JSON.stringify(oLocaleData));
}

//-------------------------------------
let jsDict:IDict|null = null;


async function StartWork() {
    if (oLocaleData.currUser && oLocaleData.currUser != "Stranger" && oLocaleData.token) {
        try{
            const oData:IApiStruct = {command:"relogin", data:{sUser: oLocaleData.currUser, token:oLocaleData.token}}
            const oAnswer = await ApiRequest(JSON.stringify(oData));

            if(oAnswer && oAnswer.result && oAnswer.result.oDict){
                jsDict = oAnswer.result.oDict;
            }
        } catch(err) {

        }
    } else {
        openBlock("SignInBlock");
    }
}

(async () => {
    await StartWork();
})();