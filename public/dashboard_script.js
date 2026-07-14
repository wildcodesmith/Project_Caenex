
const CaenexToken = localStorage.getItem("CaenexToken")
//error handling if token is not present in localstorage
if(!CaenexToken){
    window.location.href = "/"
}

try {
    async function postToken(){
        let options = {
            method : "GET",
            headers : {
                "Authorization" : "Bearer " + CaenexToken
            }
        }
        let data = await fetch('logInRequestEndPoint', options)
        let response =await data.json()
        if(!data.ok){
            localStorage.removeItem("CaenexToken")
            window.location.href = "/"
        }else{
            console.log("success")
            console.log(response)
        }

    }
    postToken()
} catch (error) {
    
}