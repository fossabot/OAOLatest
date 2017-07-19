var OAOApplicantSchema = require('../../models/OAOApplicantSchema');
var OAOSequenceGenerator = require('../../models/OAOSequenceGenerator');
var OAOPropertyDetail = require('../../models/OAOPropertyDetail');
var OAOProductTypeDetail = require('../../models/OAOProductTypeSchema');
var OAOProductDetail = require('../../models/OAOProductSchema');
var constants = require("./AppConstants");
const crypto = require('crypto');
var config = require("../../configFiles/DBconfigfile.json");
var request = require('request');
var jsonfile = require('jsonfile');
var self = module.exports = {

    //INSERT OR UPDATE APPLICANTS RECORD 
    save: function (dataSave, callback) {
        dataSave.save(function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        });
    },


    // VALIDATION
    validation: function (req, res, callback) {
        var postal_home_address_flag = req.body.postal_home_address_flag;
        var no_address_found_flag = req.body.no_address_found_flag;

        // first name 
        if (req.body.fname == "") {
            req.check('fname', 'ddd').notEmpty();
        } else if ((req.body.fname).length < 3 || (req.body.fname) > 45) {
            req.check('fname', 'name must be with spacified range (3, 45)').len(3, 45);
        } else if (re.test(req.body.fname) == false) {
            req.check('fname', 'Must contain letter and apostrophe').matches(/^[a-zA-Z '.-]+$/, 'i');
        }


        // Middle name 
        req.check('mname', 'Must contain letter and apostrophe').matches(/^[a-zA-Z '.-]+$/, 'i');
        req.check('mname', 'name must be with spacified range (3, 45)').len(3, 45);
        req.check('mname', 'middle name can not be blank').notEmpty();

        // Last name
        req.check('mname', 'Must contain letter and apostrophe').matches(/^[a-zA-Z '.-]+$/, 'i');
        req.check('mname', 'last name must be with spacified range (3, 45)').len(3, 45);
        req.check('lname', 'last name can not be blank').notEmpty();

        // date of birth
        req.check('dob', 'date of birth must be in [ YYYY-MM-DD ]').isDate({ format: 'YYYY-MM-DD' })
        req.check('dob', 'date of birth can not be blank').notEmpty();

        // Email ID
        req.check('email', 'email id can not be blank').isEmail();

        //Mobile Number
        req.check('mobile', 'Mobile number must be in +61434653192').isMobilePhone('en-AU');
        req.check('mobile', 'Mobile number can not be blank').notEmpty()

        // address
        req.check('address', 'A valid address is required').notEmpty();
        if (postal_home_address_flag == 'N') {
            req.check('paddress', 'A valid address is required').notEmpty();
        }

        if (no_address_found_flag == 'N') {
            req.check('postcode', 'A valid address is required').notEmpty();
            req.check('ppostcode', 'A valid address is required').notEmpty();
        }


        var status = req.validationErrors();
        return callback(status);
    },

    //CHECK FOR EXISTING APPLICANT IN DATABASE

    checkExistingApplicant: function (req, res, callback) {
        console.log("checking for existing cust..");
        console.log(req.body);
        OAOApplicantSchema.findOne({ application_id: req.body.application_id }, function (err, result) {
            return callback(result);
        })
    },


//GENERATE APPLICATION REFERENCE ID
    GenerateApplicationReferenceId:function(req,res,callback){
        if(req.body.application_id==undefined){
            OAOSequenceGenerator.find(function(err,result_v){
                console.log("result_v "+result_v)
       OAOSequenceGenerator.findOneAndUpdate({ "_id": "58bcf123f36d2837b81098ff"},{app_ref_id:Number(result_v[0].app_ref_id)+1},function(err,result){
            if(err){
                return err;
            }
            console.log("result "+result)
            return callback(result)
        })
         })
        }else{
            return callback("result");
        }

    },

    //UPDATING APPLICATION REFERENCE ID EVERY APPLICATION SUBMITTED

    UpdateApplicationReferenceIdGeneration: function (req, res, callback) {
        OAOSequenceGenerator.find(function (err, result) {
            OAOSequenceGenerator.findOneAndUpdate({ "_id": "58bcf123f36d2837b81098ff" }, { app_ref_id: Number(result[0].app_ref_id) + 1 }, function (err, result) {
                if (err) {
                    return err;
                }
                return callback(result)
            })
        })
    },

    //UPDATING SECTION ON BACK
    UpdateApplication: function (app_id, section, callback) {
        var section = "section_SAV[0]." + section;
        console.log(section)
        OAOApplicantSchema.findOneAndUpdate({ "application_id": app_id }, { $set: { section_SAV: { "section_2": false } } }, function (err, result) {
            if (err) {
                console.log(err)
                return err;
            }
            console.log(result)
            return callback(result)
        })

    },
    // UPDATING THE RESUMING TIME
    UpdateResumeTime: function (app_id, update_value, callback) {
        console.log("is  id " + app_id + "updating value is" + update_value);
        OAOApplicantSchema.findOneAndUpdate({ "application_id": app_id }, update_value, function (err, result) {
            if (err) {
                console.log("error is " + err);
                return err;
            }
            console.log(result);
            return callback(result);

        });
    },

    //RESETTING APPLICATION REFERENCE ID EVERY DAY

    ResetApplicationReferenceId: function (req, res, callback) {
        OAOSequenceGenerator.find(function (err, result) {
            OAOSequenceGenerator.findOneAndUpdate({ "_id": "58bcf123f36d2837b81098ff" }, { app_ref: 0 }, function (err, result) {
                if (err) {
                    return err;
                }
                return callback(result)
            })
        })
    },

    getDropboxContent: function (PropertyType, Property, callback) {
        OAOPropertyDetail.find({ property_type: PropertyType, property: Property }, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },

    getMessages: function (PropertyType, callback) {
        OAOPropertyDetail.find({ property_type: PropertyType }, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },

    saveDropboxContent: function (dropBoxRecord, callback) {
        dropBoxRecord.save(function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        });
    },

    getApplicantsRecord: function (ApplicaionID, callback) {
        OAOApplicantSchema.find({ application_id: ApplicaionID }, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);

        })
    },
    //GET SAVED RECORD 
    getSavedRecord: function (mobile, dob, callback) {
        console.log("mobile", mobile, dob);
        var query = {}
        switch (dob) {
            case 'true': query["mobile"] = mobile;
                query["product_type_code"] = { $in: ['SAV', 'HML', 'PRL'] }
                break;
            case 'no': query["mobile"] = mobile;
                query["application_status"] = { $in: ['SAV', 'INC'] }
                query["product_type_code"] = { $in: ['SAV', 'HML', 'PRL'] }
                break;
            default: query["mobile"] = mobile;
                query["dob"] = dob;
                query["application_status"] = { $in: ['SAV', 'INC'] }
                query["product_type_code"] = { $in: ['SAV', 'HML', 'PRL'] }
        }
        console.log("alljkh  ", query)
        OAOApplicantSchema.find(query, function (err, result) {
            if (err) {
                return callback(err, success = false);
            } else if ((result !== null && result != '')) {
                return callback(result, success = true);
            } else {
                console.log("res", result)
                return callback(result, success = false);
            }

        })
    },
    saveUploadData: function (file_name, file_obj_id, app_id, callback) {
        var file_data = {
            fileName: file_name,
            fileObjectId: file_obj_id
        }
        this.getApplicantsRecord(app_id, function (result) {
            if (result == "") {
                return callback(success = false)
            } else {
                result[0].filesUpload.push(file_data);
            }
            result[0].save(function (err, result) {
                if (err) {
                    return callback(success = false)
                }
                return callback(success = true)
            });
        });
    },
    addProdTypeData: function (data, callback) {
        this.getProductTypeContent(data.product_type_code, function (result) {
            if (!result || result == '') {
                console.log(data)
                data.save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            } else {
                result[0].product_type_code = data.product_type_code,
                    result[0].product_type_name = data.product_type_name,

                    result[0].save(function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(result);
                    });
            }
        })

    },
    addData: function (data, callback) {
        this.getProductContent(data.product_code, function (result) {
            if (!result || result == '') {
                console.log(data)
                data.save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            } else {
                result[0].product_code = data.product_code,
                    result[0].product_name = data.product_name,

                    result[0].child_of = data.child_of,
                    result[0].del_flg = data.del_flg
                result[0].save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            }
        })

    },
    addCSData: function (data, callback) {
        this.getCrossSellingProductContent(data.cross_selling_product_id, function (result) {
            if (!result || result == '') {
                data.save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            } else {
                result[0].cross_selling_product_id = data.cross_selling_product_id,
                    result[0].cross_selling_name = data.cross_selling_name,
                    result[0].cross_selling_desc = data.cross_selling_desc,
                    result[0].display_text = data.display_text,
                    result[0].linked_to_products = data.linked_to_products
                result[0].save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            }
        })

    },
    getProductTypeContent: function (ProductTypeCode, callback) {
        OAOProductTypeDetail.find({ product_type_code: ProductTypeCode }, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },
    getProductContent: function (ProductCode, callback) {
        console.log(ProductCode)
        OAOProductDetail.find({ product_code: ProductCode }, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },
    downloadFromAdmin: function () {

        console.log("/ChangeData")
        return new Promise((resolve, reject) => {

            request.get(config.url.adminUrl + '/api/getLocalContent', function (err, result_v) {

                var data_res = JSON.parse(result_v.body);
                var storeData = data_res.result;
                var dir = './public/contents/Product1.json'
                var obj = storeData;
                jsonfile.writeFile(dir, obj, function (err) {
                    if (err) {
                        console.log(err)
                    }
                    else
                    {
                        resolve("downloaded the file from admin");
                    }
                })
            })
        })


    },
    getProducts: function (callback) {

        OAOProductDetail.find({ del_flg: false, child_of: { $nin: ["CRS", "UPS"] } }, function (err, result) {
            if (err) {
                console.log(err);
                return callback(false, '');
            }
            else if (result == null) {
                console.log("null is coming");
                return callback(false, result);
            }
            else {
                console.log("got products");
                return callback(true, result);
            }
        })

    },
       getRelativeProducts:function(ProductTypeCode,callback){
            
        OAOProductDetail.find({del_flg:false,child_of:ProductTypeCode},function(err,result){
            if(err)
            {
                console.log(err);
               return callback(false,'');
            }
            else if(result == null)
            {
                console.log("null is coming");
                return callback(false,result);
            }
            else
            {
                console.log("got products");
                return callback(true,result);
            }
        })

    },

    getProductByParent: function (product_code, child_of, callback) {
        OAOProductDetail.find({ product_code: product_code, child_of: child_of }, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },
    //get cross sell child
    getChild: function (product, callback) {
        console.log('Inside Get Child');
        OAOProductDetail.find({ 'product_code': product }, { 'linked_crossselling_product': 1 }, function (err, result) {
            console.log(result);
            console.log(result.length);
            if (err) {
                return callback(err, success = false);
            }
            if (result.length == 0) {
                return callback(err, success = false);
            } else {
                OAOProductDetail.find({ 'product_code': result[0].linked_crossselling_product }, { 'display_text': 1, 'product_code': 1, 'child_of': 1 }, function (err, result) {
                    if (err) {
                        return callback(err, success = false);
                    }
                    return callback(result);
                })
            }

        })
    },
    getProductContent: function (ProductID, callback) {
        console.log(ProductID)
        OAOProductDetail.find({ product_code: ProductID }, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },
    encryption: function (msg, callback) {
        var cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq')
        var crypted = cipher.update(msg, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return callback(crypted);

    },
    decryption: function (crypted_msg, callback) {
        var decipher = crypto.createDecipher('aes-256-cbc', 'd6F3Efeq')
        var dec = decipher.update(crypted_msg, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return callback(dec);

    }
};