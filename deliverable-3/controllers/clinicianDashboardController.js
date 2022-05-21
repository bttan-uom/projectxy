// import people model
const Patients = require('../models/patients')
const joins = require('./joins')

// handle request to get all people data instances
const renderClinicianDashboard = async (req, res, next) => {
    try { 
        const clinician = await joins.getClinicianOnly(res.userInfo.username)
        if (!clinician) {
            return res.sendStatus(404)
        }
        const patients = await Patients.Patient.find().lean()
        return res.render('clinicianDashboard', {clinician: clinician, data: patients, layout: 'main2'})
    } catch (err) {
        return next(err)
    }
}

// handle request to get all people data instances
const renderClinicianPatientList = async (req, res, next) => {
    try {
        const PatientsList = await Patients.Patient.find().lean()
        res.render('clinicianViewAllPatients', {data: PatientsList.reverse(), layout: 'main2'})
    } catch (err) {
        return next(err)
    }  
}


// handle request to get one data instance
const getSinglePatient = async (req, res, next) => {
    // search the database by ID
    try {
        const patient = await joins.getAPatient(req.params.patient_id)
        if (!patient) {
            /* Record not associated with a patient. Should be impossible, but
            just in case */
            return res.sendStatus(404)
        }
        // found the record

        return res.render('clinicianViewPatient', {oneItem: patient, layout: 'main2'})
    } catch (err) {
        return next(err)
    }
}



// handle request to get one data instance
const getDataById = async (req, res, next) => {
    // search the database by ID
    try {
        // found the record
        const patient = await joins.getAPatient(req.params.patient_id)
        if (!patient) {
            /* Record not associated with a patient. Should be impossible, but
            just in case */
            return res.sendStatus(404)
        }
        return res.render('onePatientRecordClinician', {patient: patient, layout: 'main2', recordToShow: req.params.record_id})
    } catch (err) {
        return next(err)
    }

}

const getAddNewUserPage = async (req, res, next) => {
    try {
        const PatientsList = await Patients.Patient.find().lean()
        const clinicianUsername = res.userInfo.username

        res.render("clinicianAddPatient", {data: PatientsList.reverse(), clinician: clinicianUsername, layout: 'main2'})
    } catch (err) {
        return next(err)
    }
}

const addNewUser = async (req, res, next) => {
    try {
        newPatient = new Patients.Patient(req.body)
        await newPatient.save()

        Patients.Patient.findOneAndUpdate(
            {"email": newPatient.email}, 
            {$push: {
                    thresholds: {
                        $each: [{name: "glucose", lower: req.body.blood_glucose_lower, upper: req.body.blood_glucose_upper}, 
                                {name: "insulin", lower: req.body.insulin_lower, upper: req.body.insulin_upper},
                                {name: "weight", lower: req.body.weight_lower, upper: req.body.weight_upper},
                                {name: "exercise", lower: req.body.exercise_lower, upper: req.body.exercise_upper}]

                    },
                    assigned_records: {
                        $each: [{record_type: "glucose", is_recording: req.body.glucose_required},
                                {record_type: "insulin", is_recording: req.body.insulin_required},
                                {record_type: "weight", is_recoridng: req.body.weight_required},
                                {record_type: "exercise", is_recording: req.body.exercise_required}]
                    }
                }
            },
            (err) => {
                if (err) {
                    console.log(err)
                }
            }
        );
        
        //res.render('userAddRecordSuccess')
        patientEmail = newPatient.email
        const redirectString = "patients/" + newPatient.email
        res.redirect(redirectString)

    } catch (err) {
        return next(err)
    }
}

module.exports = {
    renderClinicianDashboard,
    getDataById,
    renderClinicianPatientList,
    getSinglePatient,
    getAddNewUserPage,
    addNewUser
}
