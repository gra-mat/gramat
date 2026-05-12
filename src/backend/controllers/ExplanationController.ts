import { ExplanationRepository } from "../models/ExplanationRepository.ts";

export class ExplanationController {
    
    explanationRepository : ExplanationRepository;
    constructor(explanationRepository: ExplanationRepository) {
        this.explanationRepository = explanationRepository;
    }
    
    getExplanationById = async (req : any, res : any) => {
        try {
            const explanationId = req.params.id;
            this.explanationRepository.getExplanation(explanationId).then((explanation) => {
            const result = {
                id: explanation.id,
                title: explanation.title,
                description: explanation.description
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
