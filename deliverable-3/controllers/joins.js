// import Patient and Clinician schemas
const Clinician = require('../models/clinicians')
const Patients = require('../models/patients')
const moment = require('moment');

/* Get clinician and patient from username */
const getClinician = async (clinician_username) => {
    try {
        const clinician = await Clinician.findOne({'email': clinician_username}).lean()
        return clinician
    } catch(err) {
        console.log(err)
    }
}

const getPatient = async (patient_username) => {
    try {
        const patient = await Patients.Patient.findOne({'email': patient_username}).lean()
        return patient
    } catch (err) {
        console.log(err)
    }
}

const getPatientById = async (id) => {
    try {
        const patient = await Patients.Patient.findById(id).lean()
        return patient
    } catch (err) {
        console.log(err)
    }
}

const getAllPatientObjects = async (clinician) => {
    try {
        const patients = []
        for (const email_obj of clinician.patients) {
            patients.push(await getPatient(email_obj.email))
        }
        return patients
    } catch (err) {
        console.log(err)
    }
}

/* Joins for records */
const getAllRecords = async (patient) => {
    try {
        const records = []
        for (const record of patient.records) {
            records.push({'user_id': patient._id, 'record_id': record._id, 'record_type': record.record_type, 'value': record.value, 'created_at': record.created_at, 'comment': record.comments})
        }
        return records
    } catch (err) {
        console.log(err)
    }
}

const getARecord = async (patient, record_id) => {
    try {
        for (const record of patient.records) {
            if (record._id == record_id) {
                return record
            }
        }
        return null
    } catch (err) {
        console.log(err)
    }
}

const getTodaysRecords = async (clinician) => {
    try {
        const start = new Date()
        start.setUTCHours(0, 0, 0, 0)
        const end = new Date()
        end.setUTCHours(23, 59, 59, 999)

        const patients = await getAllPatientObjects(clinician)

        const records = []
        for (const patient of patients) {
            if (patient == null) {
                continue
            }
            
            const patientrecords = {'username': patient.email, 'id': patient._id, 'error': ''}

            const thresholds = []
            for (const threshold of patient.thresholds) {
                thresholds.push(threshold.name)
            }

            for (const type of ['glucose', 'insulin', 'exercise', 'weight']) {
                if (!thresholds.includes(type)) {
                    patientrecords[type] = 'N/A'
                } else {
                    patientrecords[type] = 'Not recorded'
                }
            }

            for (const record of patient.records) {
                if (record.created_at >= start && record.created_at <= end) {
                    patientrecords[record.record_type] = Number(record.value)
                    patientrecords['error'] += await getWarning(patient, record.record_type, record)
                }
            }

            records.push(patientrecords)
        }

        return records
    } catch (err) {
        console.log(err)
    }
}

const getWarning = async (patient, record_type, record) => {
    if (thresholdCheck(patient, record_type, record)) {
        const uppercase = record.record_type.replace(/^\w/, (c) => c.toUpperCase())
        return uppercase + ' is outside of the threshold. '
    }
    return ''
}

const thresholdCheck = async (patient, record_type, record) => {
    const thresholds = getThresholds(patient, record_type)
    if (record.value < thresholds[0] || record.value > thresholds[1]) {
        return true
    }
    return false
}

const getThresholds = async (patient, record_type) => {
    const thresholds = []
    for (const threshold of patient.thresholds) {
        if (threshold.name == record_type) {
            thresholds.push(threshold.lower)
            thresholds.push(threshold.upper)
        }
    }
    return thresholds
}

/* Joins for messages */
const getAllMessages = async (clinician) => {
    try {
        const messages = []
        for (const email_object of clinician.patients) {
            const patient = await getPatient(email_object.email)
            if (patient == null) {
                continue
            }
            if (patient.messages != null) {
                messages.push({'first_name': patient.first_name, 'last_name': patient.last_name, 'messages': patient.messages, 'user_id': patient._id})
            } else {
                messages.push({'first_name': patient.first_name, 'last_name': patient.last_name, 'messages': [], 'user_id': patient._id})
            }
        }
        return messages
    } catch (err) {
        console.log(err)
    }
}

const listAllMessages = async (clinician) => {
    const data = []
    const allmessages = await getAllMessages(clinician)
    for (const patient of allmessages) {
        if (patient.messages != null) {
            for (const message of patient.messages) {
                data.push({'first_name': patient.first_name, 'last_name': patient.last_name, 'message': message.content, 'message_id': message._id, 'user_id': patient.user_id})
            }
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

/* Joins for clinical notes */
const getAllNotes = async (clinician) => {
    try {
        const notes = []
        for (const email_object of clinician.patients) {
            const patient = await getPatient(email_object.email)
            if (patient == null) {
                continue
            }
            if (patient.notes != null) {
                for (const note of patient.notes) {
                    notes.push({'username': patient.email, 'content': note.content, 'date': note.date, 'note_id': note._id, 'user_id': patient._id})
                }
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
    } catch (err) {
        console.log(err)
    }
}

/* Joins for leaderboard */
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

const inLeaderboard = async (patient, rankings) => {
    // Returns either 1-5 if the patient is in the leaderboard
    // 0 otherwise
    for (let i in rankings) {
        if (rankings[i]['username'] == patient.email) {
            return Number(i) + 1
        }
    }
    return 0
}

module.exports = {
    getClinician,
    getPatient,
    getPatientById,
    getAllPatientObjects,
    getAllRecords,
    getARecord,
    getTodaysRecords,
    getWarning,
    thresholdCheck,
    getThresholds,
    getAllMessages,
    listAllMessages,
    getAMessage,
    getAllNotes,
    getANote,
    getTopFive,
    inLeaderboard
}