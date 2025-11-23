const Listing = require("../models/listing");

// FOR INDEX
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });

}

// FOR NEW FORM
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

// FOR SHOW ROUTE 
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    console.log(req.user);
    // jab hame pura data chahiye tab ham populate ka use karate hai
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",

            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

// FOR THE POST
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);

    const newListing = new Listing(req.body.listing);
    // // yadi ham created huye listing ko show page par dekhanan chate hain
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "Yay! Your listing was created.");
    res.redirect("/listings");
};

// FOR THE EDIT ROUTE 
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// FOR THE UPDATE ROUTE
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        listing.save();
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    }
}

// FOR THE DELETE LISTING
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}