import { UserRepository } from '../models/UserRepository.ts';

export class UserController {
    
    userRepository : UserRepository;
    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    getUserById = async (req : any, res : any) => {
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

        } catch (err : any) {
            res.status(500).json({ error: err.message });
        }
    }

    getLoggedUser = async (req : any, res : any) => {
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

}
