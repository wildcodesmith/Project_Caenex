import mongoose from "mongoose";
const {Schema , model} = mongoose;

const accountSchema = new Schema(
    {
        userEmail : {type : String , required : true},
        userName : {type : String , required : true , unique : true},
        password : {type : String , required : true}, 
        isEmailVerified : {type : Boolean , default : false},
        isDetailsFilled : {type: Boolean, default: false},
        isSetUpComplete : {type: Boolean , default: false}
    },
    {
        timestamps  : true,
    }
);

accountSchema.index(
    {createdAt: 1},
    {
        expireAfterSeconds : 900,
        partialFilterExpression : {isSetUpComplete : false }
    }
)


const Account = model('userAccounts' , accountSchema)
export default Account