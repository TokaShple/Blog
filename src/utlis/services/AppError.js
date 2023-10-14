class AppError extends Error{
  super(message){
    this.statusCode = code;
  }
}
export default AppError;