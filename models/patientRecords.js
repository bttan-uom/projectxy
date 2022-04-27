const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    record_type: String,
    value: String,
    username: String,
    comment: String
}, { timestamps: { createdAt: 'created_at' } })

const PatientRecord = mongoose.model('patientRecord', schema)
module.exports = PatientRecord





// var patientCollection = require('./patients');//import user model file
// var resources = {
//  username: "$username"};

// userCollection.aggregate([{
//  $group: resources
// }, {
//  $lookup: {
//      from: "patientRecords", // collection to join
//      localField: "_id",//field from the input documents
//      foreignField: "username",//field from the documents of the "from" collection
//      as: "comments"// output array field
//  }
// }, {
//  $lookup: {
//      from: "Post", // from collection name
//      localField: "_id",
//      foreignField: "user_id",
//      as: "posts"
//  }
// }],function (error, data) {
//  return res.json(data);
//  //handle error case also
// });


