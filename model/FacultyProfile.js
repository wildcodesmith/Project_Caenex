import mongoose  from "mongoose";
 
const {Schema , model} = mongoose

const facultyProfileSchema = new Schema (
    {
        accountID : {type : Schema.Types.ObjectId ,ref: 'useraccounts', required : true, unique : true},
        role : {type : String , default : "student"},
        title : {type : String , required : true},
        name : {type : String , required : true},
        facultyID : {type : String , required : true},
        department : {type : String , required : true},
        designation : {type : String , required : true},
        facultyPhoneNumber : {type : Number , required : true}
    },
    {
        timestamps : true,
    }
);
const FacultyProfile = model('facultyprofile' ,facultyProfileSchema);
export default FacultyProfile