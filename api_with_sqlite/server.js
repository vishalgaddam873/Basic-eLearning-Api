const express = require('express');
const sqlite3 = require('sqlite3');
// start the app
const app = express();
const db = require('./createdb');

// data will be sent in the request body
app.use(express.json());


const courses = express.Router();
app.use('/courses',courses);

const exercises = express.Router();
app.use('/exercises',exercises);

// Task 1
// get a list of all courses
courses.get('/',(request, response, next)=>{
  let db = new sqlite3.Database('database/courses.sqlite3',(err)=>{
    if(!err){
      db.all("SELECT * FROM courses", function(err, rows){
        if(rows){
          var allCourses = [];
          rows.forEach(function(row){
            allCourses.push(
              {
                id : row.id,
                name : row.name,
                description: row.description
              });
          })
          return response.json(allCourses)
        }
        return response.json({errMsg:"Error in Database or No match found"})
      });
    };
  });
});

// Task 2
// Create list of courses
courses.post('/', (request, response, next)=>{
  `Example of request body input:
  {
  	"name": "Node",
  	"description": "Iss course mein hum ache se Node seekhenge."
  }
  `
  let db = new sqlite3.Database('database/courses.sqlite3',(err)=>{
    if(!err){
      db.run('INSERT INTO courses (name,description) VALUES (?,?)',[request.body.name,request.body.description]);
      return response.json({message:request.body.name + " course is added to Database"})
    }
    return response.json({errMsg:"Error in Database or table is not created"})
  })
})


// Task 3
// get a courses by id
courses.get('/:id',(request, response, next)=>{
  let db = new sqlite3.Database('database/courses.sqlite3',(err)=>{
    if(!err){
      db.all("SELECT * FROM courses WHERE id = " + request.params.id, function(err, course){
        console.log(course[0]);
        return response.json(course[0]);
      });
    }else{
      return response.json({errMsg:"Error in Database or No match found."})
    }
  });
});

// Task 4
// Edit courses by id
courses.put('/:id',(request, response, next)=>{
  `Example of request body input:
  {
  	"name": "Node",
  	"description": "Iss course mein hum ache se Node seekhenge."
  }
  `
  let db = new sqlite3.Database('database/courses.sqlite3',(err)=>{
    if(!err){
      db.run(
        `UPDATE courses
        SET name = ?,
        description = ?
        WHERE id = ?`,
        [request.body.name,request.body.description,request.params.id])
        course = request.body
        course['id'] = request.params.id
      return response.json(course)
    }
    return response.json({errMsg:"Error in Database or No match found"})
  })
})

// Task 5
// get all list of exercises

exercises.get('/',(request, response, next)=>{
  let db = new sqlite3.Database('database/courses.sqlite3',(err)=>{
    if(!err){
      db.all("SELECT * FROM exercises", function(err, rows){
        if(rows){
          var allExercises =[]
          rows.forEach(function(row){
            allExercises.push(
              {
                id : row.id,
                name : row.name,
                description: row.description,
                courseId : row.courseId
              });
          })
          console.log(allExercises);
          return response.json(allExercises)
        }
        return response.json({errMsg:"Error in Database or No match found"})
      });
    };
  });
});


// Task 6
// Create exercises of course by id
exercises.post('/', (request, response, next)=>{
  `Example of request body input:
  {
  	"name": "Introduction",
  	"description": "Iss exercise mein aapne yeh sab karna hai.",
  	"course_id": 1
  }`
  console.log(request.body);
  let db = new sqlite3.Database('database/courses.sqlite3',(err)=>{
    if(!err){
      db.run('INSERT INTO exercises (name,description,course_id) VALUES (?,?,?)',
      [request.body.name,request.body.description,request.body.course_id]);
      return response.json({message:request.body.name + " exercise is added to Database"})
    }
    return response.json({errMsg:"Error in Database or table is not created"})
  })
})


// Task 7
// get excercise by exercise id
exercises.get('/:id',(request,response,next)=>{
  let db = new sqlite3.Database('database/courses.sqlite3',(err)=>{
    if(!err){
      db.all('SELECT * FROM exercises WHERE id = ?',[request.params.id],function(err,exercise){
        console.log(exercise[0])
        return response.json(exercise[0])
      })
    }else{
      return response.json({errMsg:"Error in Database or No match found."})
    }
  })
})

// Task 8
// Edit exercise by excercise id
exercises.put('/:id',(request, response, next)=>{
  `Example of request body input:
  {
  	"name": "Introduction",
  	"description": "Iss exercise mein aapne yeh sab karna hai."
  }`
  let db = new sqlite3.Database('database/courses.sqlite3',(err)=>{
    if(!err){
      db.run(
        `UPDATE exercises
        SET name = ?,
        description = ?,
        course_id = ?
        WHERE id = ?`,
        [request.body.name,request.body.description,request.body.course_id,request.params.id])
        exercise = request.body
        exercise['id'] = request.params.id
        console.log(exercise);
      return response.json(exercise);
    }
    return response.json({errMsg:"Error in Database or No match found"})
  })
})



// Task 9
//  Delete the course exercises by id
exercises.delete('/:id',(request,response, next)=>{
  let db  = new sqlite3.Database('database/courses.sqlite3',(err)=>{
    if(!err){
      db.run('DELETE FROM exercises WHERE id = ? AND course_id = ?',[request.params.id,request.body.course_id])
      return response.json({message:"Exercise of course " + request.body.course_id + " is deleted"})
    }
  })
})


app.listen(8000,function(err){
  if(!err){
    console.log(`Server is listning port ${8000}`)
  }else{
    console.log("Error in code");
  }
})
