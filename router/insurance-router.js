const express = require("express");
const router = express.Router();
const insurancecontroller = require('../controller/insurance-controller');
router.route("/getinsurancepackages").post(insurancecontroller.getinsurancepackages);
module.exports = router;