const mongoose=require('mongoose')

const ActivitySchema=new mongoose.Schema([
    {
    swimming:String,
    karaoke:String,
    outdoor:String,
}
])

const ActivityModel=mongoose.model('Activity',ActivitySchema)

module.exports=ActivityModel

