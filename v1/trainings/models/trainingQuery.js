import pool from "../../../config/db.js"

export const insertTrainingDataQuery = (array) =>{
    let query = `INSERT INTO trainings (
        training_id,
        course_name,
        course_description,
        roadmap_url,
        details
    ) VALUES (?,?,?,?,?);`
    return pool.query(query, array);
}

export const getLastTrainingIdQuery = () =>{
    let query = `SELECT * FROM trainings ORDER BY training_id DESC LIMIT 1`
    return pool.query(query);
}

export const addUserTrainingInfoQuery = (array) =>{
    let query = `INSERT INTO userTrainings (
        emp_id,
        training_id,
        course_name,
        course_description,
        details,
        roadmap_url,
        progress_status
    ) VALUES (?,?,?,?,?,?,?)`
    return pool.query(query, array);
};

export const getTrainingDataQuery = (array)=>{
    let query = `SELECT trainings.course_name, trainings.course_description, trainings.details, trainings.roadmap_url FROM trainings WHERE training_id = ?`
    return pool.query(query, array);
};


export const displayDataForTrainingCardsQuery = ()=> {
    let query = `SELECT training_id, course_name, course_description, roadmap_url FROM trainings`
    return pool.query(query);
};

export const displayTrainingsForUserQuery = (array)=> {
    let query = `SELECT  training_id, course_name, course_description, status, progress_status FROM userTrainings WHERE emp_id = ?`
    return pool.query(query, array);
};

export const deleteUserTrainingDataQuery = (array)=>{
    let query = `DELETE FROM userTrainings WHERE emp_id = ? AND training_id = ?`;
    return pool.query(query, array);
}

export const getUserDataForTrainingQuery = (array)=>{
    let query = `SELECT * FROM userTrainings WHERE emp_id = ? AND training_id =?`
    return pool.query(query, array);
}

export const deleteTrainingDataQuery = (array)=>{
    let query = `DELETE FROM trainings WHERE training_id = ?`;
    return pool.query(query, array);
}

export const updateTrainingQuery = (query, array)=>{
    return pool.query(query, array);
}

export const checkSameTrainingQuery = async (array) => {
    try {
        let query = `SELECT * FROM trainings WHERE course_name = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing checkSameTrainingQuery:", error);
        throw error;
    }
}

export const checkExisitingUserTrainingDataQuery = async (array) => {
    try {
        let query = `SELECT * FROM userTrainings WHERE emp_id = ? AND training_id = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing checkExisitingUserTrainingDataQuery:", error);
        throw error;
    }
}


export const displayAllUsersTrainingDataQuery = async () => {
    try {
        let query = `SELECT  training_id, course_name, course_description,emp_id, progress_status, created_at FROM userTrainings`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing displayAllUsersTrainingDataQuery:", error);
        throw error;
    }
}