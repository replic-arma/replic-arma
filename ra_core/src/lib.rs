#[path = "./repos/a3s/mod.rs"]
mod a3s;
pub mod repository;
#[path = "./repos/swifty/mod.rs"]
mod swifty;
mod util;


#[cfg(test)]
mod tests {
    // urls:
    // grad: http://a3s.gruppe-adler.de/mods/.a3s/autoconfig
    // opt: http://repo.opt4.net/opt/.a3s/autoconfig

    use crate::{
        a3s::A3SRepository,
        swifty::SwiftyRepository,
    };

    #[test]
    fn test_swifty() {
        let swifty = SwiftyRepository::from_repo_json(String::from(
            "https://swifty.projectawesome.net/event/repo.json",
        ));

        //assert_eq!(swifty.unwrap().repo_name, "Event".to_string());
    }

    #[test]
    fn test_a3s() {
        let a3s = A3SRepository::from_auto_config(String::from(
            "http://a3s.gruppe-adler.de/mods/.a3s/autoconfig",
        ));

        assert_eq!(
            a3s.unwrap().auto_config.protocol.url,
            "a3s.gruppe-adler.de/mods".to_string()
        );
    }

    #[test]
    fn test_a3s_3cb() {
        let a3s = A3SRepository::from_auto_config(String::from(
            "http://repo.3commandobrigade.com/autoconfig",
        ));

        assert!(a3s.is_ok());

        assert!(a3s.unwrap().auto_config.protocol.url == "repo.3commandobrigade.com");
    }

    #[test]
    fn test_a3s_402() {
        let a3s = A3SRepository::from_auto_config(String::from(
            "http://repo.pzgrenbtl402.de/main/.a3s/autoconfig",
        ));

        assert!(a3s.is_ok());

        assert!(a3s.unwrap().auto_config.protocol.url == "repo.pzgrenbtl402.de/main");
    }
}
