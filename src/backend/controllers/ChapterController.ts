import { ChapterRepository } from '../models/ChapterRepository.ts';

export class ChapterController {
    
    chapterRepository : ChapterRepository;

    constructor(chapterRepository: ChapterRepository) {
        this.chapterRepository = chapterRepository;
    }

    getChapterById = async (req : any, res : any) => {
        try {
            const chapterId = req.params.id;
            this.chapterRepository.getChapter(chapterId).then((chapter) => {
            const result = {
                id: chapter.id,
                name: chapter.name,
                mathBranchId: chapter.mathBranchId,
                lessons: chapter.lessons.map(lesson => ({
                    id: lesson.id,
                    lessonId: lesson.name,
                    chapterId: lesson.chapterId
                }))
            };
            res.json(result);
            }).catch((err) => {
                res.status(500).json({ error: err.message });
            });

        } catch (err : any) {
            res.status(500).json({ error: err.message });
        }
    }

    getChapterList = async (req : any, res : any) => {
        try {
            this.chapterRepository.getChapterList().then((chapters) => {
            const result = chapters.map(chapter => ({
                    id: chapter.id,
                    name: chapter.name,
                    mathBranchId: chapter.mathBranchId,
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
