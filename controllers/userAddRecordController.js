// import people model
const peopleData = require('../models/peopleModel')

//renders the add records page for users
const getAddUserRecordsPage = (req, res) => {
    res.render('userAddRecord')
}

const addNewUserRecord = (req, res) => {
    // const { id, first_name, last_name } = req.body
    // peopleData.push({ id, first_name, last_name })
    // // res.render('userAddRecordSuccess')
    const { id, first_name, last_name } = req.body
    peopleData.push({ id, first_name, last_name })
    res.render('userAddRecordSuccess')
    //return res.redirect('userAddRecordSuccess')
}

// exports an object, which contain functions imported by router
module.exports = {
    getAddUserRecordsPage,
    addNewUserRecord
}


