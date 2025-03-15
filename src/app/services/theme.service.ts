import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private isDarkTheme = new BehaviorSubject<boolean>(false);
    isDarkTheme$ = this.isDarkTheme.asObservable();

constructor() {
    // Charger le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        this.setDarkTheme(true);
    }
}

toggleTheme() {
    this.isDarkTheme.next(!this.isDarkTheme.value);
    this.updateTheme();
}

private setDarkTheme(isDark: boolean) {
    this.isDarkTheme.next(isDark);
    this.updateTheme();
}

private updateTheme() {
    const isDark = this.isDarkTheme.value;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
}