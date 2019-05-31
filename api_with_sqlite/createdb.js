const sqlite3 = require('sqlite3')
let db = new sqlite3.Database("database/courses.sqlite3", (err) => {
    if (err) {
        console.log('Error when creating the database', err)
    } else {
        console.log('Database created!')
        /* Put code to create table(s) here */
        createTableCourses()
    }
})
const createTableCourses = () => {
    db.run('CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), description TEXT)',createTableExercise);
    console.log("Courses table created");
}

const createTableExercise = () => {
    db.run("CREATE TABLE IF NOT EXISTS exercises(id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(255),description varchar(255),course_id INTEGER FOREIGNKEY REFERENCES courses(id))");
    console.log("Exercises table created");

}

db.close();
