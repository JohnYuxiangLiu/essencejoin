const express = require("express");
const router = express.Router();
const viewController=require('../controllers/viewController')

// or
// app.get('/',(req,res)=>{
//   res.status(200).render('home')
// })

router.get("/",viewController.getOverview)

router.get("/activity",viewController.getActivity)
router.get('/activity/:id',viewController.getActivityId)

module.exports = router;