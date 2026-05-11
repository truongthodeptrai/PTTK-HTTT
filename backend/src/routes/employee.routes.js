const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const authorize = require("../middlewares/auth.middleware");

router.get("/", authorize(), employeeController.getAllEmployees);

router.post("/", authorize(["manager"]), employeeController.createEmployee);

router.put(
  "/:id/toggle-status",
  authorize(["manager"]),
  employeeController.toggleEmployeeStatus,
);

router.put(
  "/:id/reset-password",
  authorize(["manager"]),
  employeeController.resetEmployeePassword,
);

module.exports = router;
