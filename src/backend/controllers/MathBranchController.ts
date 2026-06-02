import e from 'express';
import { MathBranchRepository } from '../models/MathBranchRepository.ts';

export class MathBranchController {
    
    mathBranchRepository : MathBranchRepository;

    constructor(mathBranchRepository: MathBranchRepository) {
        this.mathBranchRepository = mathBranchRepository;
    }

    getMathBranchById = async (req : any, res : any) => {
        try {
            const mathBranchId = req.params.id;
            let withExercises = false;
            if (req.query.quiz) {
                withExercises = true;
            }
            this.mathBranchRepository.getMathBranch(mathBranchId, withExercises).then((mathBranch) => {
            let result = null;
            if (withExercises) {
            result = {
                id: mathBranch.id,
                name: mathBranch.name,
                chapters: mathBranch.chapters.map(chapter => ({
                    id: chapter.id,
                    name: chapter.name,
                    mathBranchId: chapter.mathBranchId
                })),
                exercises: mathBranch.exercises?.map(exercise => ({
                    id: exercise.id,
                    lessonId: exercise.lessonId,
                    difficultyId: exercise.difficultyId,
                    exerciseQuestion: exercise.exerciseQuestion,
                    exerciseProperties: exercise.exerciseProperties,
                    exerciseAnswer: exercise.exerciseAnswer
                }))
            };
            } else {
                result = {
                    id: mathBranch.id,
                    name: mathBranch.name,
                    chapters: mathBranch.chapters.map(chapter => ({
                        id: chapter.id,
                        name: chapter.name,
                        mathBranchId: chapter.mathBranchId
                    }))
                };
            }
            res.json(result);
            }).catch((err) => {
                res.status(500).json({ error: err.message });
            });

        } catch (err : any) {
            res.status(500).json({ error: err.message });
        }
    }

    getMathBranchList = async (req : any, res : any) => {
        try {
            this.mathBranchRepository.getMathBranchList().then((mathBranches) => {
            const result = mathBranches.map(mathBranch => ({
                    id: mathBranch.id,
                    name: mathBranch.name,
                    chapters: mathBranch.chapters.map(chapter => ({
                        id: chapter.id,
                        name: chapter.name,
                        mathBranchId: chapter.mathBranchId
                    }))
                }));
            res.json(result);
            }).catch((err) => {
                res.status(500).json({ error: err.message });
            });

        } catch (err : any) {
            res.status(500).json({ error: err.message });
        }
    }
}
