const macs= document.getElementById("macs")

let buildingRooms = document.getElementById("buildingRooms")

function createRooms(){
    let div = document.createElement('div')
div.classList.add("bg-red-500","w-30" , "h-30","m-10")
buildingRooms.append(div)
}

for(let i = 0 ; i< macs.dataset.room ; i ++){
    createRooms()
}

 
