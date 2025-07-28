import * as fs from 'fs/promises'; // Используем промисные версии fs
import * as path from 'path';

// Определяем путь к каталогу пользователей относительно корня проекта
const USERS_DIR = path.join(process.cwd(), 'users');

// Интерфейс для данных пользователя
interface UserData {
  username: string;
  password: string; // В реальном приложении пароль нужно хешировать!
}

// Интерфейс для тела POST-запроса регистрации
export interface IPostData {
  sUser?: string;
  sPassword?: string;
}

export interface IPostErr {
  message: string;
  cod: number;
}


/**
 * Проверяет существование каталога пользователей и создает его, если он не существует.
 */
export async function ensureUsersDirectoryExists(){
  try {
    await fs.mkdir(USERS_DIR, { recursive: true });
    console.log(`Users directory ensured at: ${USERS_DIR}`);
  } catch (error) {
    console.error(`Error ensuring users directory: ${error}`);
    throw new Error('Failed to ensure users directory exists.');
  }
}

/**
 * Проверяет, существует ли файл пользователя.
 * @param username Имя пользователя.
 * @returns true, если файл существует, иначе false.
 */
export async function userFileExists(username: string): Promise<boolean> {
  const userFilePath = path.join(USERS_DIR, `${username}.json`);
  try {
    await fs.access(userFilePath); // Проверяем доступность файла
    return true;
  } catch (error: any) {
    if (error.code === 'ENOENT') { // Файл не найден
      return false;
    }
    console.error(`Error checking user file existence for ${username}: ${error}`);
    throw new Error('Failed to check user file existence.');
  }
}

/**
 * Создает новый файл пользователя с предоставленными данными.
 * @param userData Объект с данными пользователя (username, password).
 */
export async function createUserFile(userData: UserData): Promise<void> {
  const userFilePath = path.join(USERS_DIR, `${userData.username}.json`);
  try {
    // В реальном приложении здесь нужно хешировать пароль перед сохранением
    await fs.writeFile(userFilePath, JSON.stringify(userData, null, 2), 'utf8');
    console.log(`User file created for ${userData.username} at ${userFilePath}`);
  } catch (error) {
    console.error(`Error creating user file for ${userData.username}: ${error}`);
    throw new Error('Failed to create user file.');
  }
}

/**
 * Читает данные пользователя из файла.
 * @param username Имя пользователя.
 * @returns Данные пользователя или null, если файл не найден.
 */
export async function readUserFile(username: string): Promise<UserData | null> {
  const userFilePath = path.join(USERS_DIR, `${username}.json`);
  try {
    const data = await fs.readFile(userFilePath, 'utf8');
    return JSON.parse(data) as UserData;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null; // Файл не найден
    }
    console.error(`Error reading user file for ${username}: ${error}`);
    throw new Error('Failed to read user file.');
  }
}

interface IUserData{
  exDict:string;
  pass:string;
  log:string;
}
interface IExDictLoadRet{
  text:string;
  obj:{text:string; err:any}
}
interface ISaveUserData{
  "abc":string;
  "login":string;
}

async function ExDictLoad(userData:IUserData, errSuff:string){
  let partsExDict = userData.exDict.split(":");
  if(partsExDict.length != 2 ){
    throw {text:"Invalid link to external dictionary: " + userData.exDict + errSuff, err:"Invalid link to external dictionary"};
  }
  let path = "users/" + partsExDict[0].toLowerCase() + "/" + partsExDict[1];
  try {
    const sDictStr = await fs.readFile(path, {encoding:'utf8'});

    return JSON.stringify({text:"User signing", text1:userData.log,
                                    text2:userData.pass, text3:sDictStr, currDict:userData.exDict});
  }catch (err:any) {
    throw {text:"File system error", err:err};
  }
}

export async function postAnswers(command:string, userData:IPostData) {
  try{
    switch(command){
      case  "newUser": {
        console.log("Sign Up: login=" + userData.sUser + ", password=" + userData.sPassword);
        if(!userData.sUser || !userData.sPassword){
          throw {message:"No user name or password", cod:-1}
        }
        let logCaseLw = userData.sUser.toLowerCase();
        fs.access("users/" + logCaseLw + "/__@@@.##__").then(()=>{
          throw {message:"User already exists", cod:-2}
        }). catch(()=>{
          fs.mkdir("users/" + logCaseLw, { recursive: true}).then(()=>{
            let userParam = JSON.stringify({"abc":userData.sPassword, "login":userData.sUser});          
            fs.writeFile("users/" + logCaseLw + "/__@@@.##__", userParam, 'utf8');
          }).catch((err)=>{
            throw {message:JSON.stringify(err), cod:-3}
          })
        })
        return "";
      }
      case "signIn": {
        console.log("Sign In: login=" + userData.sUser + ", password=" + userData.sPassword);
        if(!userData.sUser || !userData.sPassword){
          throw {message:"No user name or password", cod:-1}
        }
        let logCaseLw = userData.sUser.toLowerCase();

        const sSaveUserInfo = await fs.readFile("users/" + logCaseLw + "/__@@@.##__", 'utf8');
        const oSaveUserInfo = JSON.parse(sSaveUserInfo) as ISaveUserData;

        if(!oSaveUserInfo.abc || !oSaveUserInfo.login){
          throw {message:"Problem with user data file. Try to register with the same user ID and your dictionary will be available.", cod:-3}
        }
        if(oSaveUserInfo.abc !== userData.sPassword || oSaveUserInfo.login !== userData.sUser){
          throw {message:"No user name or password", cod:-1}
        }
        return "";
      }
    /*case "loadDict":{
      let logCaseLw = userData.user.toLowerCase();
      try {
                //({ user: user, dictName: dictName, dictBody: dictBody});
        if (!fs.existsSync("users/" + logCaseLw)){
          return JSON.stringify({text:"User not found", text1:userData.log});
        }
        fs.writeFileSync("users/" + logCaseLw + "/" + userData.dictName, JSON.stringify(userData.dictBody), 'utf8');
        let userDataSave = JSON.parse(fs.readFileSync("users/" + logCaseLw + "/__@@@.##__", 'utf8'));
        userDataSave["currDict"] = userData.dictName;
        fs.writeFileSync("users/" + logCaseLw + "/__@@@.##__", JSON.stringify(userDataSave), 'utf8');
        return JSON.stringify({text:"Dict download"});
      }catch (err) {
        return JSON.stringify({text:"File system error", text1:err});
      }
    } break;
    case "loadExDict":{
      let partsExDict = userData.exDict.split(":");
      if(partsExDict.length != 2 ){
        return JSON.stringify({text:"Invalid link to external dictionary: ", text1:userData.exDict});
      }
      let path = "users/" + partsExDict[0].toLowerCase() + "/" + partsExDict[1];
      try {
        if (!fs.existsSync(path)){
          return JSON.stringify({text:"Dictionary not found: ", text1:userData.exDict});
        }
        let dictStr = fs.readFileSync(path, 'utf8');
        return JSON.stringify({text:"Dict selected", dict:dictStr});
      }catch (err) {
        return JSON.stringify({text:"File system error", text1:err});
      }
    } break;
    case "selectDict":{
      let logCaseLw = userData.user.toLowerCase();
      try {
        if (!fs.existsSync("users/" + logCaseLw)){
          return JSON.stringify({text:"User not found", text1:userData.log});
        }
        let userDataSave = JSON.parse(fs.readFileSync("users/" + logCaseLw + "/__@@@.##__", 'utf8'));
        userDataSave["currDict"] = userData.dictName;
        fs.writeFileSync("users/" + logCaseLw + "/__@@@.##__", JSON.stringify(userDataSave), 'utf8');
        let dictStr = fs.readFileSync("users/" + logCaseLw + "/" + userData.dictName, 'utf8');
        return JSON.stringify({text:"Dict selected", dict:dictStr, currDict:userData.dictName});
      }catch (err) {
        return JSON.stringify({text:"File system error", text1:err});
      }
    } break;
      
    case "CheckFileExist":{
      let logCaseLw = userData.user.toLowerCase();
      try {
        if (!fs.existsSync("users/" + logCaseLw)){
          return JSON.stringify({text:"Didn't found user" + userData.log});
        }       
        if (fs.existsSync("users/" + logCaseLw + "/" + userData.dictName)){
          return JSON.stringify({text:"Exist", goal:userData.goal, text1:userData.dictName});
        } else {
          return JSON.stringify({text:"Not exist", goal:userData.goal});
        }
      }catch (err) {
        return JSON.stringify({text:"File system error", text2:err});
      }
    } break;
    case "ChangeDict":{
      let logCaseLw = userData.log.toLowerCase();
      try {
        let path = "users/" + logCaseLw;
        if (!fs.existsSync(path)){
          return JSON.stringify({text:"User not found", text1:userData.log});
        }
        let dictArr = fs.readdirSync(path);
        let ret = [];
        for(let i in dictArr){
          if(dictArr[i] != "__@@@.##__"){
            let dict = JSON.parse(fs.readFileSync("users/" + logCaseLw + "/" + dictArr[i], 'utf8'));
            let tmpStruct = {dictName:dictArr[i],words:[]};
            for(let j=0; j<3 && j< dict.length; j++){
              tmpStruct.words.push(dict[j]);
            }
            ret.push(tmpStruct);
          }
        }
        return JSON.stringify({text:"Dict array", text1:JSON.stringify(ret)});
      }catch (err) {
        return JSON.stringify({text:"File system error", text1:err});
      }
      
    } break;
      */
      default:
        throw {message:"Unknown command " + command, cod:-5};
    }
  } catch(err) {
    throw err;
  }
}
