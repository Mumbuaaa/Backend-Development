
Project Requirements
1. **Database Design:**
   - **Tables:**
     - **Patients:** `id`, `first_name`, `last_name`, `email`, `password_hash`, `phone`, `date_of_birth`, `gender`, `address`.
     - **Doctors:** `id`, `first_name`, `last_name`, `specialization`, `email`, `phone`, `schedule` (e.g., available days and times).
     - **Appointments:** `id`, `patient_id`, `doctor_id`, `appointment_date`, `appointment_time`, `status` (e.g., scheduled, completed, canceled).
     - **Admin:** `id`, `username`, `password_hash`, `role`.

   - **Relationships:**
     - Patients and doctors have a one-to-many relationship with appointments.
     - Admin can manage doctors and view appointments.

   - **Database Setup:**
     - Design the database schema using MySQL.
     - Create and populate tables with sample data for testing.



   
    

  


