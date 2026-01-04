import { DifficultyRepository } from '../models/DifficultyRepository.ts';

export class DifficultyController {

    difficultyRepository : DifficultyRepository;

    constructor(difficultyRepository: DifficultyRepository) {
        this.difficultyRepository = difficultyRepository;
    }

    getDifficultyById = async (req : any, res : any) => {
        try {
            const difficultyId = req.params.id;
            this.difficultyRepository.getDifficulty(difficultyId).then((difficulty) => {
                const result = {
                    id: difficulty.id,
                    name: difficulty.name
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
