
function EventHandlerFun(err,req,res,next){

   return res.status(res.statuscode || 500).json({"success":false,"mssg": err.message || "Something went w"})
}