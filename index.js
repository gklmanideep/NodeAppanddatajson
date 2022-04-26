var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.json());

// case 1
app.get("/updated:id", (req, res) => {
    res.send(req.params.id);
});

//http://localhost:8080/updated:01

//case 2

app.get("/updated", (req, res) => {
    res.send(req.query.id);
});

//http://localhost:8080/updated?id=01


//create
app.post("/add", (req, res) => {

    //get the existing user data
    const existUsers = getUserData()

    //get the new user data from post request
    const userData = req.body
    console.log(userData);
    if (userData.id == null || userData.language == null || userData.edition == null || userData.author == null) {
        return res.status(401).send({ error: true, msg: 'User data missing' })
    }
    const findExist = existUsers.find(user => user.id === userData.id)
    if (findExist) {
        return res.status(409).send({ error: true, msg: 'username already exist' })
    }
    res.send(userData);
    existUsers.push(userData);
    if (saveUserData(existUsers)) {
        return res.send("user is added Successfully");
    }
    res.send("something went wrong");
});


//get all user add from User.json
app.get('/users', (req, res) => {
    const users = getUserData()
    res.send(users);
});

app.get('/user/:id', (req, res) => {
    const existUsers = getUserData();
    let id = (req.params.id).toString();
    const findExist = existUsers.find(user => user.id === id);
    if (findExist) {
        return res.send(findExist);
    }

    res.send("something Went Wrong");

})

/* Update - Patch method */
app.patch('/update/:id', (req, res) => {
    //get the username from url
    const id = (req.params.id).toString();
    console.log(id);
    //get the update data
    const userData = req.body
    //get the existing user data
    const existUsers = getUserData()
    //check if the username exist or not       
    const findExist = existUsers.find(user => user.id === id)
    if (!findExist) {
        return res.status(409).send({ error: true, msg: 'username not exist' })
    }
    //filter the userdata
    const updateUser = existUsers.filter(user => user.id !== id)
    //push the updated data
    updateUser.push(userData)
    //finally save it
    saveUserData(updateUser)
    res.send({ success: true, msg: 'User data updated successfully' })
});

//DELETE user

app.delete('/user/:id', (req, res) => {
    const id = (req.params.id).toString();
    //get the existing userdata
    const existUsers = getUserData()
    //filter the userdata to remove it
    const filterUser = existUsers.filter(user => user.id !== id)
    if (existUsers.length === filterUser.length) {
        return res.status(409).send({ error: true, msg: 'username does not exist' })
    }
    //save the filtered data
    saveUserData(filterUser)
    res.send({ success: true, msg: 'User removed successfully' })

})



/* util functions */
//read the user data from json file
const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('data.json', stringifyData)
}

//get the user data from json file
const getUserData = () => {
    const jsonData = fs.readFileSync('data.json')
    return JSON.parse(jsonData)
}



app.listen(8080, function () {
    console.log("servering is starting 8080");
});