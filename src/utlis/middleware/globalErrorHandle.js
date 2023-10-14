const globalError = (err,req,res,next)=>{
  console.log(err);
  const status=err.statusCode || 500;
  res.status(status);
}
export default globalError;