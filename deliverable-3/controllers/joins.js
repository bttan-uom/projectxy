// import Patient and Clinician schemas
const Clinician = require('../models/clinicians')
const Patients = require('../models/patients')

/* Get clinicians */
const getClinician = async (patient_username) => {
    try {
        const patient = await getAPatient(patient_username)
        const clinician = await Clinician.findOne({'email': patient.clinician}).lean()
        return clinician
    } catch(err) {
        console.log(err)
    }
}

const getClinicianOnly = async (clinician_username) => {
    try {
        const clinician = await Clinician.findOne({'email': clinician_username}).lean()
        return clinician
    } catch(err) {
        console.log(err)
    }
}

/* Get patients */
const getAllPatients = async (clinician_username) => {
    try {
        const clinician = await getClinicianOnly(clinician_username)
        const patients = []
        for (const username of clinician.patients) {
            patients.push(await getAPatient(username))
        }
        return patients
    } catch (err) {
        console.log(err)
    }
}

const getAPatient = async (patient_username) => {
    try {
        const patient = await Patients.Patient.findOne({'email': patient_username}).lean()
        return patient
    } catch(err) {
        console.log(err)
    }
}

/* Get messages */
const getAllMessages = async (clinician_username) => {
    try {
        const messages = []
        const clinician = await getClinicianOnly(clinician_username)
        for (const patient_username of clinician.patients) {
            const patient = await getAPatient(patient_username)
            messages.push({'first_name': patient.first_name, 'last_name': patient.last_name, 'messages': patient.messages, 'user_id': patient._id})
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
            data.push({'first_name': patient.first_name, 'last_name': patient.last_name, 'message': message.content, 'message_id': message._id, 'user_id': patient.user_id})
        }
    }
    return data
}

const getAMessage = async (patient, message_id) => {
    for (const message of patient.messages) {
        if (message._id == message_id) {
            return message
        }
    }
    return null
}

/* Get clinical notes */
const getAllNotes = async (clinician) => {
    try {
        const notes = []
        for (const patient_username of clinician.patients) {
            const patient = await getAPatient(patient_username)
            for (const note of patient.notes) {
                notes.push({'username': patient_username, 'content': note.content, 'date': note.date, 'note_id': note._id, 'user_id': patient._id})
            }
        }
        return notes
    } catch (err) {
        console.log(err)
    }
}

const getANote = async (patient, note_id) => {
    try {
        for (const note of patient.notes) {
            if (note._id == note_id) {
                return note
            }
        }
        return null
    } catch {
        console.log(err)
    }
}

const getTopFive = async () => {
    try {
        let rankings = []
        const patients = await Patients.Patient.find().lean()
        
        // Get engagement rates of all patients
        for (const patient of patients) {
            rankings.push({'username': patient.email, 'engagement': patient.engagement_rate})
        }

        // Sort engagement rates and get top 5
        rankings = rankings.sort((a, b) => b.engagement - a.engagement).slice(0, 5)

        // Add position to the patients
        for (const i in rankings) {
            rankings[i]['position'] = Number(i) + 1
        }

        return rankings
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getClinician,
    getClinicianOnly,
    getAllPatients,
    getAPatient,
    getAllMessages,
    listAllMessages,
    getAMessage,
    getAllNotes,
    getANote,
    getTopFive
}