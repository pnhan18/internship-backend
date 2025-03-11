const { BadRequestError } = require("../core/error.response");
const Review = require("../models/Review.model");
const User = require("../models/User.model");

class ReviewService {

    static async getReviews(filters) {
        const condition = {};

        if (filters.sellerId) {
            condition.sellerId = filters.sellerId;
        }

        if (filters.buyerId) {
            condition.buyerId = filters.buyerId;
        }

        const reviews = await Review.findAll({
            where: condition,
            order: [['createAt', 'DESC']]
        });

        return reviews;
    }

    static async validateSellerExists(sellerId) {
        const seller = await User.findByPk(sellerId);
        if (!seller) {
            throw new BadRequestError("Seller không tồn tại.");
        }
        return seller;
    }

    static async validateReviewerExists(reviewerId) {
        const reviewer = await User.findByPk(reviewerId);
        if (!reviewer) {
            throw new Error(`Reviewer với ID ${reviewerId} không tồn tại.`);
        }
        return reviewer;
    }

    static async addReviewOfSeller({ sellerId, reviewerId, reviewTitle, content, rating }) {
        await this.validateSellerExists(sellerId);

        await this.validateReviewerExists(reviewerId);

        const newReview = await Review.create({
            sellerId,
            reviewerId,
            reviewTitle,
            reviewContent: content,
            rating
        });

        const seller = await User.findByPk(sellerId);
        const avgRating = (seller.rating + rating) / 2;
        await seller.update({ rating: avgRating });
        return newReview;
    }

    static async deleteReview(reviewId) {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            throw new BadRequestError("Review không tồn tại.");
        }
        await review.destroy();
    }
}

module.exports = ReviewService;