import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    plan:{
        type:String,
        enum:["Free", "Bronze", "Sliver", "Glod"],
        default:"Free"
    },
    expiresAt:{
        type:Date,
        default:null,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },

});

export default mongoose.model("Subscription", SubscriptionSchema);
