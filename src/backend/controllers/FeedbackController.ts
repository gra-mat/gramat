import { FeedbackRepository } from '../models/FeedbackRepository.ts';

export class FeedbackController {
    
    feedbackRepository : FeedbackRepository;
    constructor(feedbackRepository: FeedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    getFeedbackById = async (req : any, res : any) => {
        try {
            const feedbackId = req.params.id;
            this.feedbackRepository.getFeedback(feedbackId).then((feedback) => {
            const result = {
                id: feedback.id,
                userId: feedback.userId,
                exerciseId: feedback.exerciseId,
                feedbackRating: feedback.feedbackRating,
                addedPoints: feedback.addedPoints
            };
            res.json(result);
            }).catch((err) => {
                res.status(500).json({ error: err.message });
            });

        } catch (err : any) {
            res.status(500).json({ error: err.message });
        }
    }
}
