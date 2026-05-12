const express = require("express");
const { route } = require("./room.routes");
const router = express.Router();

const mockupDatabase = [];
router.get("/stay-management", (req, res) => {
  console.log("Frontend đang gọi lấy danh sách lưu trú...");
  res.json(mockupDatabase);
});
const CustomerController = require("../controllers/customer.controller");

router.get("/", CustomerController.getAllCustomers);

router.get("/:id", CustomerController.getCustomerById);

router.post("/", CustomerController.createCustomer);

router.put("/:id", CustomerController.updateCustomer);

router.delete("/:id", CustomerController.deleteCustomer);

module.exports = router;

const mockupDatabaseDeposit = [];
router.get("/deposit", (req, res) => {
  console.log("Frontend đang gọi lấy danh sách đặt cọc...");
  res.json(mockupDatabaseDeposit);
});
