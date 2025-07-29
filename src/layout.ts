import { IPostData, IDict, } from './common';
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
            const oData:IPostData = {sUser:oLocaleData.currUser, token:oLocaleData.token};
            let str = JSON.stringify({ command: "relogin", data:oData});
            const sDict = await ApiRequest(str);

            if(sDict){
                jsDict = JSON.parse(sDict);
            }
        } catch(err) {

        }
    } else {
        openBlock("SignInBlock");
    }
}

StartWork();