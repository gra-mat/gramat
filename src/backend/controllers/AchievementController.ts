import { AchievementRepository } from '../models/AchievementRepository.ts';

export class AchievementController {
    
    achievementRepository : AchievementRepository;

    constructor(achievementRepository: AchievementRepository) {
        this.achievementRepository = achievementRepository;
    }

    getAchievementById = async (req : any, res : any) => {
        try {
            const achievementId = req.params.id;
            this.achievementRepository.getAchievement(achievementId).then((achievement) => {
                const result = {
                    id: achievement.id,
                    name: achievement.name,
                    description: achievement.description,
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
