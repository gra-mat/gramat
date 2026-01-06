import { Achievement } from '../models/Achievement.ts';
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
                    imageUrl: achievement.imageUrl,
                    description: achievement.description,
                    conditions: achievement.conditions
                };
                res.json(result);
            }).catch((err) => {
                res.status(500).json({ error: err.message });
            });

        } catch (err : any) {
            res.status(500).json({ error: err.message });
        }
    }

    getAllAchievements = async (req : any, res : any) => {
        try {
            this.achievementRepository.getAllAchievements().then((achievements : Achievement[]) => {
                const result = achievements.map((achievement : Achievement) => ({
                    id: achievement.id,
                    name: achievement.name,
                    imageUrl: achievement.imageUrl,
                    description: achievement.description,
                    conditions: achievement.conditions
                }));
                res.json(result);
            }).catch((err : Error) => {
                res.status(500).json({ error: err.message });
            });
        } catch (err : any) {
            res.status(500).json({ error: err.message });
        }
    }
}
