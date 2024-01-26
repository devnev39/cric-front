import s from "./settings.json";

const settings = {
    BaseUrl : process.env.VITE_ENV === "production" ? s.BaseUrl : s.LocalUrl
}

export default settings;