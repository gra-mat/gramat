import { AchievementUnlockRepository } from '../models/AchievementUnlockRepository.ts';

export class AchievementUnlockController {
    
    achievementUnlockRepository : AchievementUnlockRepository;

    constructor(achievementUnlockRepository: AchievementUnlockRepository) {
        this.achievementUnlockRepository = achievementUnlockRepository;
    }

    getAchievementUnlockByAchievementIdAndUserId = async (req : any, res : any) => {
        try {
            const achievementId = req.query.achivmentId;
            const userId = req.query.userId;
            this.achievementUnlockRepository.getAchievementUnlock(achievementId, userId).then((achievementUnlock) => {
                const result = {
                    achievementId: achievementUnlock.achievementId,
                    userId: achievementUnlock.userId,
                    unlockDate: achievementUnlock.unlockDate,
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
