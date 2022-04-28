// import Patient and Clinician schemas
const Clinician = require('../models/clinicians')
const Patient = require('../models/patients')

const getClinician = async (patient_email) => {
    try {
        const patient = await Patient.findOne({'email': patient_email}).lean()
        const clinician = await Clinician.findOne({'email': patient.clinician})
        return clinician
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    getClinician
}