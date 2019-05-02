var express = require('express'),
    router = express.Router();
const petMongoose = require('../models/pets.js');
const userMongoose = require('../models/user.js');
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const passport = require('passport');

const util = require('../util/util.js');
const statusCode = util.statusCode;

const imageRoute = router.route('/');
const imageUploadSingle = router.route('/upload/single')
const imageUploadMul = router.route('/upload/multiple')

cloudinary.config({
    cloud_name: 'hbgto9dnt',
    api_key: '626735841878728',
    api_secret: '2_VCm07pTQCCwoyu6rYEuset1Os'
});

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "demo",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 2000, height: 2000, crop: "limit" }]
});

const parser = multer({ storage: storage });


// imageUpload.get(function(req, res) {
//     res.send(`
//         <form action='/api/image/upload' method="post" enctype="multipart/form-data">
//           <input type='file' name='image' />
//           <p><input type="submit" value="Upload"/></p>
//         </form>`);
// });

// for user to change his picture
imageUploadSingle.post(parser.single("image"), async (req, res) => {
    try{
        await passport.authenticate('jwt', {}, (ret) => {
            // console.log("hi")
            if (ret !== null){
                // console.log("in")
                const image = {};
                image.url = req.file.url;
                image.id = req.file.public_id;
                // console.log(image.url)
                userMongoose.updateOne({_id:ret._id},{imageURL:image.url},function (err,result) {
                    if (err){
                        return res.status(500).send({message: err});
                    }
                    else{
                        return res.status(200).send({
                            message: "Success",
                            data: {image:image.url}
                        });
                    }

                })
            }
            else {
                return res.status(401).send({
                    message: "Unauthorized"
                });
            }
        })(req, res);

    }
    catch (e) {
        return res.status(500).send({message: e});

    }

});

imageUploadMul.post( parser.array("petInputImage"), async (req, res) => {
    try{
        await passport.authenticate('jwt', {}, (ret) => {
            // console.log("hi")
            if (ret !== null){
                // console.log("in")
                const files = req.files;
                let image = [];
                files.forEach((file)=>{
                    image.push(file.url)
                })
                // console.log(image)
                return res.status(200).send({
                    message: "OK",
                    img:image
                })
            }
            else {
                return res.status(401).send({
                    message: "Unauthorized"
                });
            }
        })(req, res);

    }
    catch (e) {
        return res.status(500).send({message: e});

    }

});




// update image in Pet Schema
imageRoute.post((req,res)=>{
    let url = req.body.url;
    let pet_id = req.body.pet_id;
    if (!pet_id){
        res.status(statusCode.NOT_FOUND).send({
            message:"Pet Id not valid",
            data:[]
        })
    }
    else{
        petMongoose.updateOne(
            {'_id':pet_id},
            {'$addToSet':{imageURLs:url}},
            (err,pet_res)=>{
                if (err){
                    res.status(statusCode.SERVER_ERR).send({
                        message:"Server Error",
                        data:[]
                    });
                }
                else{
                    res.status(statusCode.OK).send({
                        message:"Image url added",
                        data: url
                    })
                }
            });
    }

    });

// delete image in Pet Schema
imageRoute.delete((req,res)=>{
    let url = req.body.url;
    let pet_id = req.body.pet_id;
    if (!pet_id){
        res.status(statusCode.NOT_FOUND).send({
            message:"Pet Id not valid",
            data:[]
        })
    }
    else{
        petMongoose.updateOne(
            {'_id':pet_id},
            {'$pull':{imageURLs:{'$in':url}}},
            (err,pet_res)=>{
                if (err){
                    res.status(statusCode.SERVER_ERR).send({
                        message:"Server Error",
                        data:[]
                    });
                }
                else{
                    res.status(statusCode.OK).send({
                        message:"Image url deleted",
                        data: []
                    })
                }
            });
    }

});

module.exports = router;
