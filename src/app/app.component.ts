import { __extends } from 'tslib'; // 👈 Importation concrète pour forcer Esbuild !
import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router'; // 👈 Ajouté pour Vercel

// 🦀 Importation de ton binaire WebAssembly fraîchement compilé
import init, { analyze_password } from '../../pkg/securepass_analyzer.js';

@Component({
  selector: 'app-root',
  standalone: true, // 👈 C'était déjà là, parfait !
  imports: [CommonModule, FormsModule, RouterOutlet], // 👈 Ajout du RouterOutlet ici
  template: `
    <div
      style="padding: 40px; font-family: 'Segoe UI', sans-serif; max-width: 550px; margin: 80px auto; background: #1a1a1a; color: white; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid #333;"
    >
      <h2 style="color: #00d1b2; text-align: center; font-weight: 800; letter-spacing: 2px;">
        SECUREPASS <span style="color: white;">ANALYZER</span>
      </h2>
      <p style="text-align: center; color: #666; font-size: 0.85em; margin-top: -10px;">
        Cyrivelus Cybersecurity Tool - powered by Rust (WASM)
      </p>

      <div style="margin-top: 40px;">
        <input
          #pwInput
          type="password"
          placeholder="Entrez le mot de passe..."
          style="width: 100%; padding: 15px; border: 2px solid #333; border-radius: 10px; background: #000; color: #00d1b2; font-size: 1.1em; outline: none; box-sizing: border-box;"
          (keyup.enter)="checkPass(pwInput.value)"
        />

        <button
          (click)="checkPass(pwInput.value)"
          [disabled]="loading"
          style="width: 100%; margin-top: 15px; padding: 15px; background: #00d1b2; color: #000; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; transition: 0.3s;"
        >
          {{ loading ? 'ANALYSE EN COURS...' : 'TESTER LA SÉCURITÉ' }}
        </button>
      </div>

      <div *ngIf="result" style="margin-top: 35px; border-top: 1px solid #333; padding-top: 25px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Niveau de protection :</span>
          <span [style.color]="getScoreColor(result.score)" style="font-weight: bold;">
            {{ result.strength }}
          </span>
        </div>

        <div style="height: 6px; background: #333; border-radius: 10px; overflow: hidden;">
          <div
            [style.width.%]="(result.score + 1) * 20"
            [style.background]="getScoreColor(result.score)"
            style="height: 100%; transition: 0.5s;"
          ></div>
        </div>

        <ul *ngIf="result.feedback && result.feedback.length > 0" style="margin-top: 20px; color: #999; font-size: 0.9em; padding-left: 20px;">
          <li *ngFor="let msg of result.feedback">{{ msg }}</li>
        </ul>
        
        <p *ngIf="result.score === 4 && (!result.feedback || result.feedback.length === 0)" style="margin-top: 20px; color: #00e676; font-size: 0.9em; text-align: center;">
          🔒 Excellent mot de passe ! Aucune suggestion d'amélioration.
        </p>
      </div>
    </div>
  `,
})
export class AppComponent {
  // Injection du détecteur de changements d'Angular
  private cdr = inject(ChangeDetectorRef);

  result: any = null;
  loading = false;

  getScoreColor(score: number) {
    const colors = ['#ff4d4d', '#fb8c00', '#fdd835', '#7cb342', '#00e676'];
    return colors[score] || '#999';
  }

  async checkPass(password: string) {
    if (!password) return;
    this.loading = true;
    this.result = null; // On réinitialise l'affichage précédent

    try {
      // 1. Initialisation propre pour éviter le message "deprecated"
      await init({ module_or_path: '/securepass_analyzer_bg.wasm' }); 
      
      // 2. On exécute l'analyse ultra-rapide en local
      this.result = analyze_password(password); 
      
      console.log("Résultat de l'analyse (WASM) :", this.result);

      // 3. On force Angular à rafraîchir la vue pour afficher le message au client
      this.cdr.detectChanges();
      
    } catch (erreur) {
      console.error("Erreur lors de l'exécution du module WASM :", erreur);
      alert("Erreur critique lors de l'analyse en local.");
    } finally {
      this.loading = false;
      this.cdr.detectChanges(); // Double sécurité pour le bouton "Analyse en cours"
    }
  }
}