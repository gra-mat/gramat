import { UserRepository } from '../models/UserRepository.ts';

export class UserController {

    userRepository: UserRepository;
    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    getUserById = async (req: any, res: any) => {
        try {
            const userId = req.params.id;
            this.userRepository.getUserById(userId).then((user) => {
                const result = {
                    id: user.getId(),
                    name: user.getName(),
                    email: user.getEmail(),
                    authProvider: user.getAuthProvider(),
                    avatarUrl: user.getAvatarUrl(),
                    permissions: user.getPermissions(),
                    points: user.getPoints(),
                    strengths: user.getStrengths(),
                    weaknesses: user.getWeaknesses(),
                    suggestedExercises: user.getSuggestedExercises()
                };
                res.json(result);
            }).catch((err) => {
                res.status(500).json({ error: err.message });
            });

        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    getUserCachedAvatarById = async (req: any, res: any) => {
        const userId = req.params.id;
        if (await this.userRepository.checkIfUserAvatarIsCached(userId)) {
            return res.sendFile(`/avatars/${userId}.jpg`, { 'root': '.' });
        }
        return res.status(404).send('Avatar not found');
    }

    getLoggedUser = async (req: any, res: any) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not logged in' });
        }

        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            avatarUrl: req.user.avatarUrl,
            permissions: req.user.permissions,
            points: req.user.points,
            strengths: req.user.strengths,
            weaknesses: req.user.weaknesses,
            suggestedExercises: req.user.suggestedExercises
        });
    }

    getLeaderboard = async (req: any, res: any) => {
        try {
            this.userRepository.getLeaderboard().then((leaderboard) => {
                res.json(leaderboard);
            }).catch((err) => {
                res.status(500).json({ error: err.message });
            });

        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    getSkills = async (req: any, res: any) => {
        try {
            const userId = req.params.id; 
            const skills = await this.userRepository.getUserSkills(userId);
            res.json(skills);
        } catch (err: any) {
            const status = err.message.includes('not found') ? 404 : 500;
            res.status(status).json({ error: err.message });
        }
    };

    updateSkillByDelta = async (req: any, res: any) => {
        try {
            const userId = req.params.id;
            const { skillName, delta } = req.body;

            if (!skillName || typeof skillName !== 'string') {
                return res.status(400).json({ error: 'skillName required' });
            }
            if (typeof delta !== 'number' || isNaN(delta)) {
                return res.status(400).json({ error: 'delta must be a number' });
            }

            let skills = await this.userRepository.getUserSkills(userId);
            const current = skills[skillName] ?? 0;
            skills[skillName] = current + delta;
            await this.userRepository.updateUserSkills(userId, skills);

            res.json({ message: 'Skill updated', skills });
        } catch (err: any) {
            const status = err.message.includes('not found') ? 404 : 500;
            res.status(status).json({ error: err.message });
        }
    };
}
