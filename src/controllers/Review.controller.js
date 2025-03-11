const { OK } = require('../core/success.response');
const ReviewService = require('../services/Review.service');

class ReviewController {
    static async getReviews(req, res) {
        const { sellerId, buyerId } = req.query;
    
        const reviews = await ReviewService.getReviews({ sellerId, buyerId });
    
        new OK("Success", reviews).send(res);
    }

    static async addReviewOfSeller(req, res) {
        const { sellerId } = req.params;
        const reviewData = req.body;
    
        const result = await ReviewService.addReviewOfSeller({ sellerId, ...reviewData });
        
        new OK("Success", result).send(res);
    }
    

    static async deleteReview(req, res) {
        new OK("Success", await ReviewService.deleteReview(req.params.reviewId)).send(res);
    }
}

module.exports = ReviewController;