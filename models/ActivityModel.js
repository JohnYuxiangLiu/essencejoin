const mongoose=require('mongoose')

const activitySchema=new mongoose.Schema([
    {
    swimming:String,
    karaoke:String,
    outdoor:String,
}
])

const activityModel=mongoose.model('Activity',activitySchema)

module.exports=activityModel

