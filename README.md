# SecurepassAnalyzer 🛡️🦀

Ce projet est un outil de cybersécurité moderne d'analyse de force de mot de passe. Il utilise une architecture **Edge Computing** : l'analyse est effectuée directement dans le navigateur de l'utilisateur grâce à un moteur écrit en **Rust** et compilé en **WebAssembly (WASM)**. Aucune donnée ne transite sur internet.

Ce projet a été initialement généré avec [Angular CLI](https://github.com/angular/angular-cli).

---

## 🏗️ Architecture & Technologies

* **Frontend :** Angular (Standalone Components).
* **Moteur d'analyse :** Rust (`zxcvbn` crate pour l'estimation d'entropie).
* **Liaison :** WebAssembly (`wasm-pack` & `wasm-bindgen`).

---

##  Installation et Configuration

### 1. Prérequis
Assurez-vous d'avoir installé sur votre machine :
* [Node.js](https://nodejs.org/) (pour Angular)
* [Rust](https://www.rust-lang.org/) (pour compiler le moteur)
* **wasm-pack** pour générer le binaire WASM :
  ```powershell
  cargo install wasm-pack