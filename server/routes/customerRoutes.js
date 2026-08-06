const router = require("express").Router();
const {
    createCustomer,
    getCustomers,
    getCustomerById,
    searchByPhone,
    updateCustomer,
    getCustomerBillHistory,
    deleteCustomer
} = require("../controllers/customerController");

// Customer routes
router.post("/", createCustomer);
router.get("/", getCustomers);
router.get("/search", searchByPhone);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.get("/:id/bills", getCustomerBillHistory);
router.delete("/:id", deleteCustomer);

module.exports = router;