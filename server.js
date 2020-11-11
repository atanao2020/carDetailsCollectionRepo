const express      = require('express'),
      app          = express(),
      port         = 2020,
      mongoose     = require('mongoose'),
      carSchema    =  require("./models/carSchema"),
      methodOverride = require('method-override')

//================================================MongooseDB Connection
mongoose.connect('mongodb+srv://atanao:dontinon@cluster0.enweg.mongodb.net/CarDetailsDB?retryWrites=true&w=majority', 
{useNewUrlParser:true,useUnifiedTopology:true}, 
    function(err,database){
        if(err){
           throw err
        }
        console.log("Connection made to Database")
   }
)
 
//================================================Middlewears
app.use(express.urlencoded({ extended: true }))
app.set("view engine","ejs") 
app.use(methodOverride('X-HTTP-Method-Override'))

//================================================Root route to go to the index.ejs
app.get('/', (req, res) =>{
    res.render("index")
})

//================================================Posting car details from the form to the database
app.post('/car-details', function(req, res) {
    console.log("Car Details POST route hit")
    console.log(req.body)
    var carName = req.body.name
    var carPlateNo = req.body.plateNo
    var carColour = req.body.colour
    var carModel = req.body.model
    
    carSchema.create({
        name: carName,
        plateNo:carPlateNo,
        colour: carColour,
        model: carModel
    })
    .then(function(car){
        console.log('Car Details Saved')
        console.log(car)
        res.send(`<body style="background-color:steelblue">
                       <center><h1> Car Details Submitted Successfully </h1><br><br>
                       <div>
                           <button><a href="/"> Log Out </a></button>
                       </div>
                       <div>
                           <button><a href="/view-car-info"> View Car Details </a></button>
                       </div><center>
                  </body>`)
    })
    .catch(function(err){
        console.log(err)
    })
})

//=====================================================Retrieving car details from the database
app.get('/view-car-info', (req, res) =>{
    carSchema.find({}, function(err, profile){
        res.render("carProfile", { profile : profile});
        console.log(profile)
    })
})

//====================================================Deleting car records from the database
app.get('/delete-car-record:id', (req, res) =>{
    const id = req.params.id
    carSchema.findOneAndDelete(id, function(err, user) {
        if (err){
            throw err
        } 
        console.log(id)
        res.redirect('/view-car-info')
    })
})

//====================================================Updating car records in the database
app.get('/update-car-record', (req, res) =>{
    carSchema.findOne({}, function(err, profile){
        res.render("updateCar", { profile : profile});
    })
})

app.post('/update-car-record:id', (req, res) =>{
        updateRecord(req, res)
})
function updateRecord(req, res) {
    carSchema.findOneAndUpdate({ "id": req.body.id },{
        $set: {
            "name": req.body.name,
            "plateNo": req.body.plateNo,
            "colour": req.body.colour,
            "model": req.body.model
        }
     }, { new: true }, (err, car) => {
        if (!err) {  
            console.log(car);
            console.log(req.body);
            res.redirect('/view-car-info'); 
        }
        else {
            console.log(err);
        }
     });
    }

//=======================================================Calling the port which the server is running on
app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})