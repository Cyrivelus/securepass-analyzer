use wasm_bindgen::prelude::*;
use serde::Serialize;
use zxcvbn::zxcvbn;

#[derive(Serialize)]
pub struct AnalysisResponse {
    pub score: u32,
    pub strength: String,
    pub feedback: Vec<String>,
}

#[wasm_bindgen]
pub fn analyze_password(password: &str) -> JsValue {
    // 1. On execute zxcvbn et on "déballe" le Result avec .expect()
    let estimate = zxcvbn(password, &[]).expect("Échec de l'analyse du mot de passe");

    // 2. Conversion du score (u8 transformé en u32)
    let score_val = estimate.score() as u32;

    let strength_text = match score_val {
        0 => "Très Faible",
        1 => "Faible",
        2 => "Moyen",
        3 => "Fort",
        4 => "Très Fort",
        _ => "Inconnu",
    };

    // 3. Récupération des suggestions avec format! pour forcer la conversion en String
    let mut suggestions: Vec<String> = Vec::new();
    if let Some(feedback) = estimate.feedback() {
        for s in feedback.suggestions() {
            // format! transforme l'énumération Suggestion directement en String
            suggestions.push(format!("{}", s));
        }
    }

    let res = AnalysisResponse {
        score: score_val,
        strength: strength_text.to_string(),
        feedback: suggestions,
    };

    // 4. On transforme la structure Rust en objet JS
    serde_wasm_bindgen::to_value(&res).unwrap()
}