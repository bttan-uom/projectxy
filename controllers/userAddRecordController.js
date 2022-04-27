// import people model
// const res = require('express/lib/response')
const Author = require('../models/patientRecords')
//const peopleData = require('../models/peopleModel')


const getAddUserRecordsPage = (req, res) => {
    res.render('userAddRecord')
}


const addNewUserRecord = async (req, res, next) => {
    try {
        newAuthor = new Author( req.body )
        await newAuthor.save()
        res.render('userAddRecordSuccess', {oneItem: author})
    } catch (err) {
        return next(err)
    }
}

//const getDataById = async (req, res, next) => {
//  // search the database by ID
//  try {
//      const author = await Author.findById(req.params.patientRecord_id).lean()
//      if (!author) {
//          // no author found in database
//          return res.sendStatus(404)
//      }
//      // found the author
//      return res.render('oneData', {oneItem: author})
//  } catch (err) {
//      return next(err)
//  }
//  
//}

// exports an object, which contain functions imported by router
module.exports = {
    getAddUserRecordsPage,
    addNewUserRecord
}

