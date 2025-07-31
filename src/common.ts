export interface IMapsOfAny{
    [key: string]: any;
}

export interface IPostData {
  sUser?: string;
  sPassword?: string;
  token?:string;
}

export interface IPostErr {
  message: string;
  cod: number;
}

export interface ServerResponse {
    result?: {token?:string, oDict?:IDict};
    error?: string;

}

export interface IApiStruct{
  command:"relogin"|"newUser"|"signIn"|"dictListRequest"|"dictRequest"|"dictLoad"|"logout";
  data:IPostData;
}

export interface IWordCart{
    t:string;
    w:string;
    rem:boolean;
}
export interface IDict{
    dictName:string;
    words:IWordCart[];
}
