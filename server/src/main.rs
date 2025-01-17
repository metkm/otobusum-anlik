use axum::{serve, Router};
use tower_http::{compression::CompressionLayer, services::ServeDir, trace::TraceLayer};
use tracing::info;
use tracing_subscriber::fmt::format::FmtSpan;

#[tokio::main(flavor = "current_thread")]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .with_span_events(FmtSpan::CLOSE)
        .init();

    let router = Router::new()
        .fallback_service(ServeDir::new("../dist"))
        .layer(
            CompressionLayer::new()
                .gzip(true)
                .deflate(true)
                .zstd(true)
                .br(true),
        )
        .layer(TraceLayer::new_for_http());

    let port = std::env::var("PORT").unwrap_or("8000".to_string());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", &port))
        .await
        .unwrap();

    info!("listening on port {:?}", &port);
    serve(listener, router).await.unwrap();
}
