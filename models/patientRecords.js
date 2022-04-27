const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    record_type: String,
    value: String,
    username: String,
}, { timestamps: { createdAt: 'created_at' } })

const PatientRecord = mongoose.model('patientRecord', schema)
module.exports = PatientRecord


//
//
//const mongoose = require('mongoose')
//
//const schema = new mongoose.Schema({
//  record_type: String,
//  value: String,
//  username: String,
//})
//
//const PatientRecord = mongoose.model('patientRecord', schema)
//module.exports = PatientRecord
//
//
//
//
//var patientCollection = require('./patients');//import user model file
//var resources = {
//  username: "$nick_name"};
//
//userCollection.aggregate([{
//  $group: resources
//}, {
//  $lookup: {
//      from: "Comments", // collection to join
//      localField: "_id",//field from the input documents
//      foreignField: "user_id",//field from the documents of the "from" collection
//      as: "comments"// output array field
//  }
//}, {
//  $lookup: {
//      from: "Post", // from collection name
//      localField: "_id",
//      foreignField: "user_id",
//      as: "posts"
//  }
//}],function (error, data) {
//  return res.json(data);
//  //handle error case also
//});