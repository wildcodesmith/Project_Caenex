import mongoose  from "mongoose";
 
const {Schema , model} = mongoose

const studentProfileSchema = new Schema (
    {
        accountID : {type : Schema.Types.ObjectId ,ref: 'useraccounts', required : true},
        role : {type : String , default : "student"},
        name : {type : String , required : true},
        gender : {type : String , required : true},
        rollNumber : {type : String , required : true},
        branch : {type : String , required : true},
        academicYear : {type : String , required : true},
        studentPhoneNumber : {type : Number , required : true}
    },
    {
        timestamps : true,
    }
);
const StudentProfile = model('studentprofile' ,studentProfileSchema);
export default StudentProfile