import qs from 'qs';
const root = 'http://localhost:8000'

function user(input:{
    data: string;
},headers:{
    "content-type": "application/json";
}):Promise<{
    input: string;
}>{
    const body = JSON.stringify(input)
    const query = ''
    return fetch(root+"/api/user/user"+query,{
        method:"post",
        headers,
        body
    }).then(res=>res.json())
}

function hello(input:{
    data: string;
},headers?:undefined):Promise<{
    input: string;
}>{
    const body = null
    const query = '?'+qs.stringify(input)
    return fetch(root+"/api/v2/hello"+query,{
        method:"get",
        headers,
        body
    }).then(res=>res.json())
}

export  {user,hello}
