//Build the server

const express = require('express');
const db = require('./database');

const app = express();

const port = 3000;

//Middleware to parse JSON bodies
app.use(express.json())

//Interacting with the database
//1.Create Tables

//Patients Table
app.get('/createPatientsTable', (req, res) => {
    const sql = `
    CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    date_of_birth   DATE NOT NULL,
    gender VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL
    )
    `;
    //run query
    db.query(sql, (err) => {
        if(err){
            console.log('Error creating Patients Table', err)
            return res.status(500).send('Error Creating Patient Table')
        }
        res.send('Patients Table created successfully')
    })

})

//Doctors Table
//Error for this table was for a comma misplaced
app.get('/createDoctorsTable', (req, res) => {
    const sql1 = `
    CREATE TABLE IF NOT EXISTS doctors(
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    specialization VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    schedule DATETIME NOT NULL
    )`;

    db.query(sql1, (err) => {
        if (err) {
            console.log('Error creating Doctors Table')
            return res.status(500).send('Error creating Doctors Table')

        }
        res.send('Doctors Table created successfully!')
    })
})

//Appointments Table
app.get('/createAppointmentsTable', (req, res) => {
    const sql2 = `
    CREATE TABLE IF NOT EXISTS appointments(
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('scheduled', 'completed','canceled') NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctos(id) ON DELETE CASCADE
    )
    `;

    db.query(sql2, (err) => {
        if (err){
            console.log('Error creating Appointment Table')
            return res.status(500).send('Error creating Appointments Table')
        }
        res.send('Appointments Table created successfully!')
    })
})    
//Admin Table
app.get('/createAdminTable', (req, res ) => {
    const sql3 = `
    CREATE TABLE IF NOT EXISTS admin(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
    )
    `;
    db.query(sql3, (err) => {
        if (err) {
            console.log('Error creating Admin Table')
            res.status(500).send('Error creating Admin Table')
        }
        res.send('Admin Table Created successfully!')

    })
})
//Admin Route to view all doctors
app.get('/admin/doctors', (req, res) => {
    const sql4 = `SELECT * FROM DOCTORS`
    db.query(sql4, (err, results) => {
        if(err){
            console.log('Error getting doctors')
            res.status(500).send('Error retrieving doctors')
        }
        res.send('Doctors retrieved successfully!')
        // res.json(results);

    })
})

//Admin Route to add a new doctor
app.post('/admin/doctor', express.json(), (req, res) => {
    const {first_name, last_name, email, specialization, phone, schedule} = req.body;
    const sql5  = `INSERT INTO doctors (first_name, last_name, email, specialization, phone, schedule)
    VALUES(?, ?, ?, ?, ?, ?)`;

    db.query(sql5, [first_name, last_name, email, specialization, phone, schedule], (err) => {
        if (err){

            return res.status(500).send('Error Adding Doctor')
        }
        res.send('Doctor added successfully')
    })
})

//Admin route to delete a doctor
app.delete('/admin/doctors/:id', (req, res)=> {
    const doctor_id = req.params.id;
    const sql6 = `DELETE FROM doctors WHERE id = ?`

    db.query(sql6, [doctor_id], (err) => {
        if(err){
            return res.status(500).send('Error deleting doctor');
        }
        res.send('Doctor deleted successfully!')
    })
})

//Admin route to view all appointments
//Error was on missing dot on last join; doctors.id
app.get('/admin/appointments', (req, res) => {
    const sql7 = `
    SELECT
    appointments.id,
    patients.first_name AS patient_first_name,
    patients.last_name AS patient_last_name,
    doctors.first_name AS doctors_first_name,
    doctors.last_name AS doctors_last_name,
    appointments.appointment_date,
    appointments.appointment_time,
    appointments.status
    FROM appointments
    JOIN patients ON appointments.patient_id=patients.id
    JOIN doctors ON appointments.doctor_id = doctors.id
    `;

    db.query(sql7 , (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving appointments')
        }
        res.json(results)
    })
})
//INSERT PATIENTS
//Error: comma between values, date format;dates should be surrounded by single quotes
app.get('/createPatient', (req, res) => {
    const sql8 = `
    INSERT INTO patients(first_name, last_name, email, password, phone, date_of_birth, gender, address)
    VALUES
    ('Vivian', 'Mutanu', 'viv@gmail.com', '1234', '123', '1998-12-18', 'Female', 'Nrb'),
    ('Joseph', 'Katua', 'joe@gmail.com', '5678', '456', '1998-10-10', 'Male', 'Kisumu')
    
    `
    db.query(sql8, (err) => {
        if(err){
            console.log('Error creating Patient')
            return res.status(500).send('Error creating Patient')
        }
        res.send('Patient record created successfully!')
        
    })
})
//CREATE DOCTORS
//Error:Schedule was of DATETIME type not VARCHAR
app.get('/createDoctor', (req, res) => {
    const sql9 = `
    INSERT INTO doctors(first_name, last_name, email, specialization, phone, schedule)
    VALUES
    ('Henry', 'Wambua', 'henry@gmail.com', 'peadeatrics', '789', '2024-10-24 10:30:00'),
    ('Yvonne', 'Syekonyo', 'yvonne@gmail.com', 'gynaecology', '100', '2024-10-25 12:45:00')
    `
    db.query(sql9, (err) => {
        if(err) {
            console.log('Error creating doctor', err)
            return res.status(500).send('Error creating doctor')
        }
        res.send('Doctor record created successfully!')
    })
})
//CREATE APPOINTMENTS
//Error: missing commas between values, extra apostrophe, improper data types; patient_id and doctor_id are integers so no need of quotes
app.get('/createAppointment', (req, res) => {
    const sql10 = `
    INSERT INTO appointments(patient_id, doctor_id, appointment_date, appointment_time, status)
    VALUES
    (1,1 ,'2024-12-12','09:00:00','scheduled'),
    (2,1, '2024-11-01', '07:30:00', 'scheduled'),
    (1, 2, '2024-10-31', '14:30:00','canceled')
    `
    db.query(sql10, (err) => {
        if(err) {
            console.log('Error creating appointment')
            return res.status(500).send('Error creating appointment')

        }
        res.send('Appointment created successfully')
        
    })

})

//CREATE ADMIN
//No error
app.get('/createAdmin', (req, res) => {
    const sql11 = `
    INSERT INTO admin(username, password, role)
    VALUES
    ('Andrew', '1034', 'Database Admin'),
    ('Milan', '1124', 'Database Admin Assistant')
    `
    db.query(sql11, (err) => {
        if(err){
            console.log('Error creating Admin')
            return res.status(500).send('Error creating Admin')
        }
        res.send('Admin created sucessfully')
    })
})

















































//Landing Route
app.get('/', (req, res) => {
    res.status(200).send('You are now using the express package')

})

//Launch server
app.listen (port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})