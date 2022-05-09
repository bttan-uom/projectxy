// import Patient and Clinician schemas
const Clinician = require('../models/clinicians')
const Patient = require('../models/patients')

const getClinician = async (patient_username) => {
    try {
        const patient = await Patient.findOne({'email': patient_username}).lean()
        const clinician = await Clinician.findOne({'email': patient.clinician}).lean()
        return clinician
    } catch(err) {
        console.log(err)
    }
}

const getAllPatients = async (clinician_username) => {
    try {
        const clinician = await Clinician.findOne({'email': clinician_username}).lean()
        return clinician.patients
    } catch(err) {
        console.log(err)
    }
}

const getAPatient = async (patient_username) => {
    try {
        const patient = await Patient.findOne({'email': patient_username}).lean()
        return patient
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    getClinician,
    getAllPatients,
    getAPatient
}