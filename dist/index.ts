import qs from 'qs';
const root = 'http://localhost:8000'

function user(input:{
    data: string;
}):Promise<{
    input: string;
}>{
    const body = JSON.stringify(input)
    const query = ''
    return fetch(root+"/api/user"+query,{
        method:"post",
        headers:JSON.parse('{}'),
        body
    }).then(res=>res.json())
}

function hello(input:{
    data: string;
}):Promise<{
    input: string;
}>{
    const body = null
    const query = '?'+qs.stringify(input)
    return fetch(root+"/api/hello"+query,{
        method:"get",
        headers:JSON.parse('{}'),
        body
    }).then(res=>res.json())
}

export  {user,hello}
