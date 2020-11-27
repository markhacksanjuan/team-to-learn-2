const mongoose = require('mongoose')
const chalk = require('chalk')

mongoose
.connect(process.env.MONGODB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(connection => {
    console.log(chalk.green.inverse.bold(`Connected to Mongo!`))
})
.catch(err => {
    console.log(chalk.red.inverse.bold('Error connecting to Mongo: ', err))
})