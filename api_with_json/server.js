const express = require('express');
const app = express();
const fs = require("fs");

app.use(express.json());


// Task 1
app.get('/courses',(req,res)=>{
  // First read the exisiting courses.
  fs.exists(__dirname + '/data/courses.json',(exists)=>{
    if(exists){
      fs.readFile(__dirname + '/data/courses.json',(err,data)=>{
          let courses = JSON.parse(data.toString(),null,2);
          return res.json(courses);
        })
      }else{
        coursesList = []
        myJSON = JSON.stringify(coursesList,null,2);
        fs.writeFile(__dirname + '/data/courses.json',myJSON,(err,data)=>{
          return res.json(coursesList);
      })
    }
  })
})

// Task 2
app.post('/courses', function (req, res) {
    `Example of request body input:
    {
    	"name": "Node",
    	"description": "Iss course mein hum ache se Node seekhenge."
    }`
    // Create New course.
    var course = req.body;
    fs.readFile( __dirname + "/data/courses.json",(err, data)=>{
        if(err){
            return res.json({errorMsg:"Check your json file"});
        }else{
            coursesList = JSON.parse( data );
            course['id'] = coursesList.length + 1;
            if(course.hasOwnProperty('name') && course.hasOwnProperty('description')){
              coursesList.push(course);
              var myJSON = JSON.stringify(coursesList,null,2);
              fs.writeFile(__dirname + "/data/" + "courses.json",myJSON,(err,data)=>{
                    return res.json(course)
              });
            }else{
              return res.json({errorMsg:"Check your json file"})
            }
        };
    });
 })

// Task 3
//Get course by id
 app.get('/courses/:id',(req,res)=>{
   fs.readFile( __dirname + "/data/courses.json",(err,data)=>{
     if(err){
       return res.json({errorMsg:"Check your json file"})
     }else{
       coursesList = JSON.parse(data)
       for(var course of coursesList){
         if(course['id'] === parseInt(req.params.id)){
           var flag = true;
           break;
         }else{
           var flag = false
          }
        }
       if(flag == true){
         return res.json(course);
       }
       else if(flag == false){
         return res.json({errMsg:"Check your given course id,It is wrong!"});
       }
     }
   })
 })

//Task 4
// Update courses by id
app.put('/courses/:id',(req,res)=>{
  `Example of request body input:
  {
  	"name": "Node",
  	"description": "Iss course mein hum ache se Node seekhenge."
  }`
  fs.readFile(__dirname + "/data/courses.json",(err,data)=>{
    coursesList = JSON.parse(data)
    for(var course of coursesList){
      if(course['id'] === parseInt(req.params.id)){
        if(req.body.hasOwnProperty('name') && req.body.hasOwnProperty('description')){
          course['name'] = req.body['name']
          course['description'] = req.body['description']
        }else{
          return res.json({errorMsg:"Check your Json."})
        }
      };
    };
    var myJSON = JSON.stringify(coursesList,null,2)
    fs.writeFile(__dirname + "/data/courses.json",myJSON,(err,data)=>{
      return res.json(coursesList[parseInt(req.params.id) -1])
    });
  });
});

// Task 5
// Read List of all excercises
app.get('/courses/:id/exercises',(req,res)=>{
  fs.readFile(__dirname + "/data/exercises.json",(err,data)=>{
    var newList = []
    var exercisesList = JSON.parse(data)
    for(var exercise of exercisesList){
      if(exercise['courseId'] == parseInt(req.params.id)){
        newList.push(exercise)
      }
    }
    if(newList.length === 0){
      return res.json({errorMsg:"This exercise is not available"})
    }
    return res.json(newList)
  })
})

// Task 6
// Create excercise of corresponding excercises
app.post('/courses/:id/exercises',(req,res)=>{
  `Example of request body input:
  {
    "name": "Introduction",
    "content": "Iss exercise mein aapne yeh sab karna hai.",
    "hint": "Hello! Yeh ek hint hai!!!!"
  },`
  exercises = req.body
  fs.readFile(__dirname + "/data/exercises.json",(err,data)=>{
    if(err){
      return res.json({errorMsg:"Check your json file"})
    }else{
      var exercisesList = JSON.parse(data)
      exercises['id'] = exercisesList.length + 1
      exercises['courseId'] = parseInt(req.params.id);
      if(req.body.hasOwnProperty('name') && req.body.hasOwnProperty('content') && req.body.hasOwnProperty('hint')){
        exercisesList.push(exercises)
        myJSON = JSON.stringify(exercisesList,null,2)
        fs.writeFile(__dirname + '/data/exercises.json',myJSON,(err,data)=>{
          return res.json(exercises)
        })
      }else{
        return res.json({errMsg:'Check your json file'})
      }
    }
  })
})

// Task 7
// Read excercises by id
app.get('/courses/:cid/exercises/:eid',(req,res)=>{
  fs.readFile(__dirname + '/data/exercises.json',(err,data)=>{
    exercisesList = JSON.parse(data)
    for(var exercise of exercisesList){
      if(exercise['courseId'] == parseInt(req.params.cid)){
        if(exercise['id'] == parseInt(req.params.eid)){
          return res.json(exercise)
        }
      }
    }
    return res.json({errorMsg:"Check Json file"})
  })
})

// Task 8
//Update exercises by id
app.put('/courses/:cid/exercises/:eid',(req,res)=>{
  `Example of request body input:
  {
    "name": "Introduction",
    "content": "Iss exercise mein aapne yeh sab karna hai.",
    "hint": "Hello! Yeh ek hint hai!!!!"
  },`
  fs.readFile(__dirname + "/data/exercises.json",(err,data)=>{
    exercisesList = JSON.parse(data)
    for(var exercise of exercisesList){
      if(exercise['courseId'] == parseInt(req.params.cid)){
        if(exercise['id'] == parseInt(req.params.eid)){
          if(req.body.hasOwnProperty('name') || req.body.hasOwnProperty('content') || req.body.hasOwnProperty('hint')){
            exercise['name'] = req.body['name'];
            exercise['content'] = req.body['content'];
            exercise['hint'] = req.body['hint']
          }
        }
      }
    }
    var myJSON = JSON.stringify(exercisesList)
    fs.writeFile(__dirname + "/data/excercises.json", myJSON,(err,data)=>{
        for(exe of exercisesList){
          if(exe['id'] == parseInt(req.params.eid)){
              return res.json(exe)

          }
        }
        return res.json({errorMsg:"Check your json file"})

      });
  });
});

//Task 9
// submissions
app.get('/courses/:cid/exercises/:eid/submissions',(req,res)=>{
  fs.readFile(__dirname + '/data/submissions.json',(err,data)=>{
    submissionsList = JSON.parse(data,null,2)
    return res.json(submissionsList)
  })
})

//Task 10
// Create submissions
app.post('/courses/:cid/exercises/:eid/submissions',(req,res)=>{
  `Example of request body input:
  {
    "content": "Yaha aapki submissions ka content.",
    "userName": "Rishabh Verma",
  }`
  submission = req.body
  fs.readFile(__dirname + '/data/submissions.json',(err,data)=>{
    submissionsList = JSON.parse(data)
    submission['id'] = submissionsList.length + 1
    submission['courseId'] = parseInt(req.params.cid)
    submission['exerciseId'] = parseInt(req.params.eid)
    submissionsList.push(submission)

  myJSON = JSON.stringify(submissionsList,null,2)
  fs.writeFile(__dirname + "/data/submissions.json",myJSON,(err,data)=>{
    return res.json(submissionsList)
  })

  })
})

app.listen(8000,()=>{
  console.log("Server Working Properly")
})
