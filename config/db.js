if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: 'linkdb'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}