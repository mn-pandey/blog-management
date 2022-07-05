const jwt = require("jsonwebtoken");
const { default: mongoose } = require('mongoose');

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


//----- authentication process to validate the person ----------------------------------------//
const authentication = async function (req, res, next) {
    try {
        let token = (req.headers["x-api-key"])

        if (!token) {
            return res.status(400).send({ status: false, msg: "Token must be present", });
        }

        let decodedToken = jwt.verify(token,'author-blog')     // decoding token 

        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "Token is invalid" });
        }
             next()
       }
       
    
    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }

}

//-------------------------authorization process to authorize the person -------------------------------//
const authorization = async function (req, res, next) {
    try {

        let id = req.query.authorId
        if(!isValidObjectId(id)){
            return res.status(400).send({status:false,msg:"please provide valid authorId in query param"})
        }
        let token = (req.headers["x-api-key"])
        let decodedToken = jwt.verify(token, "author-blog")           // verifying the token 

        if (!id)
            return res.status(401).send({ status: false, msg: "authorId must be present" });


        let userLoggedIn = decodedToken.authorId;
        console.log(userLoggedIn)
        let userToBeModified = id;
        console.log(userToBeModified)
        if (userLoggedIn == userToBeModified) {                    // checking the person is authorized or not 
            next()
        }
        else {
             return res.status(403).send({ status: false, msg: "author logged in is not allowed to modify or access the author data" });
        }
    }

    catch (err) {
      return  res.status(500).send({ msg: "Error", error: err.message })
    }

}

module.exports.authentication = authentication
module.exports.authorization = authorization





