const bodyParser = require('body-parser');
const express =require('express');
const app = express();

const port = 3000;
const mongoose = require('mongoose'); //to connect to mongodb
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));




//register view engine
app.set('view engine', 'ejs');
//middleware and static files
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());

mongoose.connect("mongodb+srv://akshith:1WRzwPw3fzuqPucv@cluster0.lb5yk0y.mongodb.net/result?retryWrites=true&w=majority",{ useNewUrlParser: true});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected"));





const teachersignupdetails={
    email:String,
    password:String,
    confirmpassword: String
};

const studentdetail={
    name:String,
    rollno:Number,
    password:String,
    confirmpassword:String
}

const marksdetails={
    rollno:Number,
    marks:Number
}

const Teacher=new mongoose.model('teachers',teachersignupdetails);

const student=new mongoose.model('studentdetails',studentdetail);

const Marks=new mongoose.model('marks',marksdetails);


let marking = [];




app.get('/',function(req,res){
    const name = 'akshith';
    res.render('index',{name:name});
})

app.get('/teacherlogin', function(req, res) {
    res.render('teacherlogin');
  });

app.post('/teacherlogin',function(req,res){
    const useremail=req.body.email;
    const password=req.body.password;
    const incorrect="incorrect password";
    const correct="";
    Teacher.findOne({email:useremail}).then((foundUser,err)=>{
        if(err)
        console.log("user not found!!");
        else{
            if(foundUser){
                if(foundUser.password===password)
                res.redirect('teacherview');
                else
                res.render('wrongpassword');
            }
        }
    }).catch(()=>{
        console.log("error occured");
    });
});

app.get('/wrongpassword',function(req,res){
    res.render('wrongpassword');
});

  app.get('/studentlogin', function(req, res) {
    res.render('studentlogin');
  });

  function studentmark(studentroll){
     return Marks.findOne({rollno:studentroll}).exec();
  }

  app.post('/studentlogin',function(req,res){
       const studentroll=req.body.rollno;
       const password=req.body.password;

       student.findOne({rollno:studentroll}).then((foundUser,err)=>{
        if(err)
        console.log("user not found!!");
        else{
            if(foundUser){
                if(foundUser.password===password)
                {
                    studentmark(studentroll).then((data)=>{
                        let requiredmark=data.marks;
                        res.render('studentview',{score : requiredmark});
                    });
                }
                else
                console.log("incorrect password");
            }
        }
       }).catch(()=>{
        console.log("error occured");
       });
  });

  app.get('/teachersignup',function(req,res){
    res.render('teachersignup');
  });

  app.post('/teachersignup',function(req,res){
       const newteacher=new Teacher({
        email:req.body.email,
        password:req.body.password,
        confirmpassword:req.body.confirmpassword
       })
       if(req.body.password===req.body.confirmpassword){
       newteacher.save().then(()=>{
        console.log("succesfully saved");
       }).catch(()=>{
        console.log("error has occured");
       });
    }
    else{
        console.log("passwords doesn't match");
    }

  });



  app.get('/studentsignup',function(req,res){
    res.render('studentsignup');
  });

  app.post('/studentsignup',function(req,res){
     
    const newstudent=new student({
        name:req.body.name,
        rollno:req.body.rollno,
        password:req.body.password,
        confirmpassword:req.body.confirmpassword
    });
    if(req.body.password===req.body.confirmpassword){
        newstudent.save().then(()=>{
         console.log("succesfully saved student");
         res.redirect('teacherview');
        }).catch(()=>{
         console.log("error has occured");
        });
     }
     else{
         console.log("passwords doesn't match");
     }
  });


  // Function to fetch marks data
function fetchMarksData() {
    return Marks.find({}).exec();
  }
  
  app.get('/teacherview', function (req, res) {
    let name = "akshith";
  
    fetchMarksData()
      .then((data) => {
        res.render('teacherview', { record: data, name: name });
      })
      .catch((error) => {
        console.log(error);
        res.render('teacherview', { record: [], name: name });
      });
  });
  


  
// const eachmarks=Marks.find({});

// app.get('/teacherview',function(req,res) {
//     let name="akshith";
//     eachmarks.exec().then((data,error)=>{
//          if(error){
//            console.log(error);
//          }
//          else
//          res.render('teacherview',{record : data,name:name});
//     }).catch((error)=>{
//         console.log(error);
//     });
    
// });

// res.render('teacherview',{name:name,score:Marks});
  

app.get('/entermarks',function(req,res){
    res.render('entermarks');
});

app.post('/entermarks',function(req,res){
    
    const newmark=new Marks({
        rollno: req.body.rollno,
        marks:req.body.marks
    });
    newmark.save().then(()=>{
        console.log("succesfully saved marks");

        res.redirect('teacherview');
       }).catch(()=>{
        console.log("error has occured");
       });
});


app.get('/studentview',function(req,res){
    res.render('studentview');
});

app.post('/studentview',function(req,res){

})


app.listen(3000,function(req,res){
    console.log("listening on port 3000");
});