const ReviewController = require("../controllers/Review.controller");
const validate = require("../middlewares/validate.middleware");
const CatchAsync = require("../utils/CatchAsync");
const { reviewSchema } = require("../validators/review.validator");

const router = require("express").Router();

router.get("/", CatchAsync(ReviewController.getReviews));
router.post("/", validate(reviewSchema), CatchAsync(ReviewController.addReviewOfSeller));
router.delete("/:reviewId", CatchAsync(ReviewController.deleteReview));

module.exports = router;