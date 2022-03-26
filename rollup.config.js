
console.log(process.env.TARGET);

if(!process.env.TARGET){
  throw new Error('TARGET package must be specified via --environment flag')
}
