export class Feedback {
    id: number;
    userId: number;
    exerciseId: number;
    feedbackRating: number;
    addedPoints: number;


    constructor(id: number, userId: number, exerciseId: number, feedbackRating: number, addedPoints: number) {
        this.id = id;
        this.userId = userId;
        this.exerciseId = exerciseId;
        this.feedbackRating = feedbackRating;
        this.addedPoints = addedPoints;
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getUserId(): number {
        return this.userId;
    }

    setUserId(userId: number): void {
        this.userId = userId;
    }

    getExerciseId(): number {
        return this.exerciseId;
    }

    setExerciseId(exerciseId: number): void {
        this.exerciseId = exerciseId;
    }

    getFeedbackRating(): number {
        return this.feedbackRating;
    }

    setFeedbackRating(feedbackRating: number): void {
        this.feedbackRating = feedbackRating;
    }

    getAddedPoints(): number {
        return this.addedPoints;
    }

    setAddedPoints(addedPoints: number): void {
        this.addedPoints = addedPoints;
    }
}