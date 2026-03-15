export class User {
    id: string;
    name: string;
    email: string | null;
    password: string | null;
    authProvider : string | null;
    avatarUrl: string | null;
    permissions: string | null;
    points: number | null;
    strengths: string | null;
    weaknesses: string | null;
    suggestedExercises: string | null;
    stats : string | null;

    constructor(id: string, name: string, email: string | null, password: string | null, authProvider: string | null, avatarUrl: string | null, permissions: string | null, points: number | null, strengths: string | null, weaknesses: string | null, suggestedExercises: string | null, stats: string | null) {
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
        this.stats = stats;
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

    getEmail(): string | null {
        return this.email;
    }

    setEmail(email: string | null): void {
        this.email = email;
    }

    getPassword(): string | null {
        return this.password;
    }

    setPassword(password: string | null): void {
        this.password = password;
    }

    getAuthProvider(): string | null {
        return this.authProvider;
    }
    
    setAuthProvider(authProvider: string | null): void {
        this.authProvider = authProvider;
    }

    getAvatarUrl(): string | null {
        return this.avatarUrl;
    }
    
    setAvatarUrl(avatarUrl: string | null): void {
        this.avatarUrl = avatarUrl;
    }
    
    getPermissions(): string | null {
        return this.permissions;
    }

    setPermissions(permissions: string | null): void {
        this.permissions = permissions;
    }

    getPoints(): number | null {
        return this.points;
    }

    setPoints(points: number | null): void {
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

    getStats(): string | null {
        return this.stats;
    }
    
    setStats(stats: string | null): void {
        this.stats = stats;
    }
}