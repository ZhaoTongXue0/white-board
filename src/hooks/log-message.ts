export const LogMessage = (message: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message);
  }
}
