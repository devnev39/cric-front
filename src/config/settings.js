import s from "./settings.json";

const settings = {
    BaseUrl : process.env.REACT_APP_ENV === "production" ? s.BaseUrl : s.LocalUrl
}

export default settings;