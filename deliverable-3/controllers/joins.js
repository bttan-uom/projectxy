// import Patient and Clinician schemas
const Clinician = require('../models/clinicians')
const Patient = require('../models/patients')

const getClinicianOnly = async (clinician_username) => {
    try {
        const clinician = await Clinician.findOne({'email': clinician_username}).lean()
        return clinician
    } catch(err) {
        console.log(err)
    }
}


const getClinician = async (patient_username) => {
    try {
        const patient = await Patient.Patient.findOne({'email': patient_username}).lean()
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
        const patient = await Patient.Patient.findOne({'email': patient_username}).lean()
        return patient
    } catch(err) {
        console.log(err)
    }
}

const getAllMessages = async (clinician_username) => {
    try {
        const messages = []
        const patients = await getAllPatients(clinician_username)
        for (const patient_username of patients) {
            const patient = await getAPatient(patient_username)
            messages.push({'first_name': patient.first_name, 'last_name': patient.last_name, 'messages': patient.messages})
        }
        return messages
    } catch (err) {
        console.log(err)
    }
}

const listAllMessages = async (clinician_username) => {
    const data = []
    const allmessages = await getAllMessages(clinician_username)
    for (const patient of allmessages) {
        for (const message of patient.messages) {
            data.push({'first_name': patient.first_name, 'last_name': patient.last_name, 'message': message.content})
        }
    }
    return data
}

module.exports = {
    getClinician,
    getAllPatients,
    getAPatient,
    getClinicianOnly,
    getAllMessages,
    listAllMessages
}