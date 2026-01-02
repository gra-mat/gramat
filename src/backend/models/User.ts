export class User {
    id: string;
    name: string;
    email: string;
    password: string | null;
    authProvider : string;
    avatarUrl: string | null;
    permissions: string;
    points: number;
    strengths: string | null;
    weaknesses: string | null;
    suggestedExercises: string | null;

    constructor(id: string, name: string, email: string, password: string | null, authProvider: string, avatarUrl: string | null, permissions: string, points: number, strengths: string | null, weaknesses: string | null, suggestedExercises: string | null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.authProvider = authProvider;
        this.avatarUrl = avatarUrl;
        this.permissions = permissions;
        this.points = points;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.suggestedExercises = suggestedExercises;
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getEmail(): string {
        return this.email;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    getPassword(): string | null {
        return this.password;
    }

    setPassword(password: string | null): void {
        this.password = password;
    }

    getAuthProvider(): string {
        return this.authProvider;
    }
    
    setAuthProvider(authProvider: string): void {
        this.authProvider = authProvider;
    }

    getAvatarUrl(): string | null {
        return this.avatarUrl;
    }
    
    setAvatarUrl(avatarUrl: string | null): void {
        this.avatarUrl = avatarUrl;
    }
    
    getPermissions(): string {
        return this.permissions;
    }

    setPermissions(permissions: string): void {
        this.permissions = permissions;
    }

    getPoints(): number {
        return this.points;
    }

    setPoints(points: number): void {
        this.points = points;
    }

    getStrengths(): string | null {
        return this.strengths;
    }
    
    setStrengths(strengths: string | null): void {
        this.strengths = strengths;
    }

    getWeaknesses(): string | null {
        return this.weaknesses;
    }

    setWeaknesses(weaknesses: string | null): void {
        this.weaknesses = weaknesses;
    }

    getSuggestedExercises(): string | null {
        return this.suggestedExercises;
    }
    
    setSuggestedExercises(suggestedExercises: string | null): void {
        this.suggestedExercises = suggestedExercises;
    }
}