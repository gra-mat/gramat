export class Achievement {
    id: number;
    name: string;
    imageUrl: string;
    description: string;
    conditions: string;

    constructor(id: number, name: string, imageUrl: string, description: string, conditions: string) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
        this.conditions = conditions;
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getImageUrl(): string {
        return this.imageUrl;
    }
    
    setImageUrl(imageUrl: string): void {
        this.imageUrl = imageUrl;
    }

    getDescription(): string {
        return this.description;
    }
    
    setDescription(description: string): void {
        this.description = description;
    }

    getConditions(): string {
        return this.conditions;
    }

    setConditions(conditions: string): void {
        this.conditions = conditions;
    }
}