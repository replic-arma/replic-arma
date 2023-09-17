use declarative_discord_rich_presence::{
    activity::{Activity, Assets, Timestamps},
    DeclarativeDiscordIpcClient,
};
use tauri::State;

#[tauri::command]
pub async fn discord_set_activity(
    details: &str,
    state: &str,
    timestamp: i64,
    image: &str,
    client: State<'_, DeclarativeDiscordIpcClient>,
) -> Result<(), ()> {
    client
        .set_activity(
            Activity::new()
                .state(state)
                .details(details)
                .timestamps(Timestamps::new().start(timestamp))
                .assets(Assets::new().large_image(image)),
        )
        .ok();

    Ok(())
}
