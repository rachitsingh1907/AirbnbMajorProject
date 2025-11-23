const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


// INDEX + CREATE
router.route("/")
  .get(wrapAsync(ListingController.index))                     // INDEX
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.createListing)                 // CREATE
  );


// NEW FORM
router.get("/new", isLoggedIn, ListingController.renderNewForm);

// SHOW + UPDATE + DELETE
router.route("/:id")
  .get(wrapAsync(ListingController.showListing))               // SHOW
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.updateListing)                 // UPDATE
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(ListingController.destroyListing)                // DELETE
  );

// EDIT FORM
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.renderEditForm)
);

module.exports = router;
