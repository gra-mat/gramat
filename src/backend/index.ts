import { Database } from './models/Database.ts';

import { ExerciseRepository } from './models/ExerciseRepository.ts';
import { ExerciseController } from './controllers/ExerciseController.ts';
import { exerciseRoutes } from './routes/ExerciseRoutes.ts';

import { LessonRepository } from './models/LessonRepository.ts';
import { LessonController } from './controllers/LessonController.ts';
import { lessonRoutes } from './routes/LessonRoutes.ts';

import { AchievementRepository } from './models/AchievementRepository.ts';
import { AchievementController } from './controllers/AchievementController.ts';
import { achievementRoutes } from './routes/AchievementRoutes.ts';

import { AchievementUnlockRepository } from './models/AchievementUnlockRepository.ts';
import { AchievementUnlockController } from './controllers/AchievementUnlockController.ts';
import { achievementUnlockRoutes } from './routes/AchievementUnlockRoutes.ts';

import { ChapterRepository } from './models/ChapterRepository.ts';
import { ChapterController } from './controllers/ChapterController.ts';
import { chapterRoutes } from './routes/ChapterRoutes.ts';

import { DifficultyRepository } from './models/DifficultyRepository.ts';
import { DifficultyController } from './controllers/DifficultyController.ts';
import { difficultyRoutes } from './routes/DifficultyRoutes.ts';

import { FeedbackRepository } from './models/FeedbackRepository.ts';
import { FeedbackController } from './controllers/FeedbackController.ts';
import { feedbackRoutes } from './routes/FeedbackRoutes.ts';

import { MathBranchRepository } from './models/MathBranchRepository.ts';
import { MathBranchController } from './controllers/MathBranchController.ts';
import { mathBranchRoutes } from './routes/MathBranchRoutes.ts';

import { UserRepository } from './models/UserRepository.ts';
import { UserController } from './controllers/UserController.ts';
import { userRoutes } from './routes/UserRoutes.ts';

import { fileURLToPath } from 'url';

import path from 'path';

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import dotenv from 'dotenv';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(session({ secret: `${process.env.SESSION_SECRET}` || 'default_secret' }));
app.use(passport.initialize());
app.use(passport.session());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend')));

const dbPath = './gramatDatabase.db';

// function isLoggedIn(req : any, res : any, next : any) {
//   req.user ? next() : res.sendStatus(401);
// }

async function init() {
    const db = new Database(dbPath);
    await db.connect();

    const exerciseRepository = new ExerciseRepository(db);
    const exerciseController = new ExerciseController(exerciseRepository);
    app.use("/exercise", exerciseRoutes(exerciseController));

    const lessonRepository = new LessonRepository(db);
    const lessonController = new LessonController(lessonRepository);
    app.use("/lesson", lessonRoutes(lessonController));

    const achievementRepository = new AchievementRepository(db);
    const achievementController = new AchievementController(achievementRepository);
    app.use("/achievement", achievementRoutes(achievementController));

    const achievementUnlockRepository = new AchievementUnlockRepository(db);
    const achievementUnlockController = new AchievementUnlockController(achievementUnlockRepository);
    app.use("/achievementUnlock", achievementUnlockRoutes(achievementUnlockController));
    
    const chapterRepository = new ChapterRepository(db);
    const chapterController = new ChapterController(chapterRepository);
    app.use("/chapter", chapterRoutes(chapterController));

    const difficultyRepository = new DifficultyRepository(db);
    const difficultyController = new DifficultyController(difficultyRepository);
    app.use("/difficulty", difficultyRoutes(difficultyController));

    const feedbackRepository = new FeedbackRepository(db);
    const feedbackController = new FeedbackController(feedbackRepository);
    app.use("/feedback", feedbackRoutes(feedbackController));

    const mathBranchRepository = new MathBranchRepository(db);
    const mathBranchController = new MathBranchController(mathBranchRepository);
    app.use("/mathBranch", mathBranchRoutes(mathBranchController));

    const userRepository = new UserRepository(db);
    const userController = new UserController(userRepository);
    app.use("/user", userRoutes(userController));

    passport.use(new GoogleStrategy({
        clientID: `${process.env.GOOGLE_CLIENT_ID}`,
        clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
        callbackURL: `http://localhost:${PORT}/auth/google/callback`
    },
    async function(accessToken : any, refreshToken : any, profile : any, cb : any) {
        if (await userRepository.checkIfUserExists(profile.id)) {
            const user = await userRepository.getUserById(profile.id);
            return cb(null, user);
        } 
        
        //if (await userRepository.checkIfUserExists(profile.id)) {
    //await userRepository.updateUserAvatar(profile.id, profile.photos[0].value); 
    //const user = await userRepository.getUserById(profile.id);
    //return cb(null, user);
    //}
        
        else {
            const user = await userRepository.createUserWithGoogle(profile.id, profile.displayName, profile.emails[0].value, profile.photos[0].value);
            return cb(null, user);
        }
    }
    ));

    passport.serializeUser(function(user : any, cb : any) {
        // console.log('Serializing user:', user);
        cb(null, user.id);
    });

    passport.deserializeUser(async function(id : any, cb : any) {
        // console.log('Deserializing user with id:', id);
        const user = await userRepository.getUserById(id);
        cb(null, user);
    });

    app.get('/login', (req, res) => {
        res.send('<a href="/auth/google">Login with Google</a>');
    });

    app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/account.html',
        failureRedirect: '/login'
    }));

    // app.get('/profile', isLoggedIn, (req : any, res) => {
    //     console.log(req.user);
    //     res.send(`<img src="${req.user.avatarUrl}"/> <br><br> Hello, ${req.user.name} <br><br> <a href="/logout">Logout</a>`);
    // });

    app.get('/logout', (req, res) => {
        req.logout((err) => {
            if (err) { return console.error(err); }
            req.session.destroy((err) => { 
                if (err) {
                    console.error(err);
                }
                // console.log("Session destroyed");
                res.redirect('/login');   
            });
        });
    });

}

//wysylanie danych do fronta
app.get('/api/me', (req: any, res) => {
        if (req.user) {
            const { password, ...safeUser } = req.user; 
            res.json(safeUser);
        } else {
            res.status(401).json({ error: 'Not logged in' });
        }
    });

app.listen(PORT, () => {
    console.log(`Gramat is running on port ${PORT}`);
    init();
});

