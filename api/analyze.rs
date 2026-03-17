use vercel_runtime::{run, body::Body, http::StatusCode, handler, Request, Response, Error};
use serde::{Deserialize, Serialize};
use zxcvbn::zxcvbn;

#[derive(Deserialize)]
struct PasswordRequest {
    pass: String,
}

#[derive(Serialize)]
struct AnalysisResponse {
    score: u32,
    feedback: String,
    crack_time: String,
}

#[handler]
async fn handler(req: Request) -> Result<Response<Body>, Error> {
    // 1. Parser le corps de la requête
    let body: PasswordRequest = serde_json::from_slice(&req.body())
        .map_err(|_| Error::from("JSON invalide"))?;

    // 2. Analyse de sécurité avec Rust
    let estimate = zxcvbn(&body.pass, &[])?;

    let res = AnalysisResponse {
        score: estimate.score(), // de 0 à 4
        feedback: format!("Temps pour craquer : {}", estimate.crack_times_display().offline_fast_hashing_1e10_per_second()),
        crack_time: format!("Suggestion : {:?}", estimate.feedback().as_ref().map(|f| f.suggestions())),
    };

    // 3. Réponse JSON
    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .header("Access-Control-Allow-Origin", "*")
        .body(Body::from(serde_json::to_string(&res)?))?)
}
