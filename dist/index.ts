import qs from 'https://esm.sh/qs@6.11.1';
const root = 'http://localhost:8000'

function user(input:{
    data: string;
},_headers?:undefined):Promise<{
    input: string;
}>{
    const headers = Object.assign(JSON.parse('{"content-type":"application/json"}'),_headers??{})
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
},_headers?:undefined):Promise<{
    input: string;
}>{
    const headers = Object.assign(JSON.parse('{}'),_headers??{})
    const body = null
    const query = '?'+qs.stringify(input)
    return fetch(root+"/api/v2/hello"+query,{
        method:"get",
        headers,
        body
    }).then(res=>res.json())
}

export  {user,hello}
