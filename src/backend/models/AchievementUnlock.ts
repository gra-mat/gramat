export class AchievementUnlock {
    achievementId: number;
    userId: number;
    unlockDate: string;

    constructor(achievementId: number, userId: number, unlockDate: string) {
        this.achievementId = achievementId;
        this.userId = userId;
        this.unlockDate = unlockDate;
    }

    getAchievementId(): number {
        return this.achievementId;
    }

    setAchievementId(achievementId: number): void {
        this.achievementId = achievementId;
    }

    getUserId(): number {
        return this.userId;
    }

    setUserId(userId: number): void {
        this.userId = userId;
    }

    getUnlockDate(): string {
        return this.unlockDate;
    }
    
    setUnlockDate(unlockDate: string): void {
        this.unlockDate = unlockDate;
    }
}