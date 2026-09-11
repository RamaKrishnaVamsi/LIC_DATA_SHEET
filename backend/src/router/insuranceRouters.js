const express = require("express");
const router = express.Router();

const {
    createInsuranceForm,
    getAllInsuranceForms,
    getInsurance,
    updateInsuranceForm,
    deleteInsuranceForm
} = require("../controller/dataController.js");

//create
router.post("/" , createInsuranceForm)

//Get all
router.get("/" , getAllInsuranceForms)

//Get one
router.get("/:id", getInsurance)

//update
router.put("/:id", updateInsuranceForm)

//delete
router.delete("/:id" ,deleteInsuranceForm)

module.exports = router