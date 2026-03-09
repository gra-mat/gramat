import { store } from "../store.js";

const mock_user = {
    "id": 1,
    "name": "admin",
    "email": "admin@gramat.com",
    "authProvider": "local",
    "avatarUrl": null,
    "permissions": "all",
    "points": 0,
    "strengths": [],
    "weaknesses": [],
    "suggestedExercises": [],
}

const profile = (({ id, name, email, avatarUrl }) => ({ id, name, email, avatarUrl }))(mock_user);
const stats = (({ strengths, weaknesses, suggestedExercises }) => ({ strengths, weaknesses, suggestedExercises }))(mock_user);
const points = { points: mock_user.points };
const finished_lessons = [];
const achievements = [];

store.set('profile', profile);
store.set('stats', stats);
store.set('points', points);
store.set('achivements', achievements);
store.set('completed_lessons', finished_lessons);