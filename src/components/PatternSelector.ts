import { WinPattern, PatternSelection } from '../types';
import { PatternValidator } from '../services/PatternValidator';

export class PatternSelector {
    private container: HTMLElement;
    private selectedPatterns: Set<string>;

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement;
        this.selectedPatterns = new Set();
        this.initialize();
    }

    private initialize(): void {
        const patterns = PatternValidator.getDefaultPatterns();
        this.container.innerHTML = `
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <i class="bi bi-grid-3x3"></i> Patrones de Victoria
                </div>
                <div class="card-body">
                    <div class="row g-3" id="pattern-list">
                        ${patterns.map(pattern => this.createPatternCard(pattern)).join('')}
                    </div>
                </div>
            </div>
        `;
        this.addEventListeners();
    }

    private createPatternCard(pattern: WinPattern): string {
        return `
            <div class="col-md-4">
                <div class="card pattern-card" data-pattern="${pattern.name}">
                    <div class="card-body">
                        <h6 class="card-title">${pattern.name}</h6>
                        ${this.createPatternGrid(pattern.pattern)}
                    </div>
                </div>
            </div>
        `;
    }

    private createPatternGrid(pattern: boolean[][]): string {
        return `
            <div class="pattern-grid">
                ${pattern.map(row => 
                    row.map(cell => 
                        `<div class="pattern-cell ${cell ? 'active' : ''}"></div>`
                    ).join('')
                ).join('')}
            </div>
        `;
    }

    private addEventListeners(): void {
        const patternCards = this.container.querySelectorAll('.pattern-card');
        patternCards.forEach(card => {
            card.addEventListener('click', () => {
                const patternName = card.getAttribute('data-pattern') as string;
                if (this.selectedPatterns.has(patternName)) {
                    this.selectedPatterns.delete(patternName);
                    card.classList.remove('selected');
                } else {
                    this.selectedPatterns.add(patternName);
                    card.classList.add('selected');
                }
            });
        });
    }

    getSelectedPatterns(): string[] {
        return Array.from(this.selectedPatterns);
    }
}
