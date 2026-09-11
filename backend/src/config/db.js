const mongoose = require("mongoose")

const MongoUrl = process.env.MONGOURL || "mongodb+srv://rvsrkvamsi_db_user:LjIcoBgUNR0cNNRD@user.uh1gjo8.mongodb.net/?appName=User";

main().then(()=>{
    console.log("Mongodb connected succesfully")
}).catch((err)=>{
    console.log(err);
    console.log("mogodb connection error",err.message)
    process.exit(1);
})

async function main(){
    await mongoose.connect(MongoUrl);
}