import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    public currentTheme = new BehaviorSubject<string>('light');
    currentTheme$ = this.currentTheme.asObservable();
    availableThemes = ['dark', 'light', 'theme2', 'theme3'];

    constructor() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && this.availableThemes.includes(savedTheme)) {
            this.setTheme(savedTheme);
        } else {
            this.setTheme('light');
        }
    }

    setTheme(themeName: string) {
        if (this.availableThemes.includes(themeName)) {
            this.currentTheme.next(themeName);
            this.updateTheme(themeName);
        }
    }

    private updateTheme(themeName: string) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);
    }
}