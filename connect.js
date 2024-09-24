const { connect } = require("mongoose")

let connectToMongo = (url) =>{
  return connect(url)

}

module.exports = {
    connectToMongo,
}