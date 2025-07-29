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
    resalt?: string;
    error?: string;
}

export interface IApiStruct{
  command:string;
  data:IPostData;
}

export interface IWordCart{
    t:string;
    w:string;
    rem:boolean;
}
export interface IDict{
    name:string;
    wc:IWordCart[];
}
