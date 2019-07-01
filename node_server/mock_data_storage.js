//mock data for testing
//probably eventually replace with some kind of light weight SQL DB.
module.exports.mockShotStorage = [
    {
        roaster: "Counter culture",
        bean: "Apollo",
        grinder_setting: "1.8",
        dose_amount_grams: 34,
        brew_amount_grams: 12,
        brew_time_seconds: 35,
        bitter_sour: "+2 (bitter)",
        issues: "",
        id: 1,
        timestamp: new Date("2019-06-19 11:30")
    },
    {
        roaster: "Counter culture",
        bean: "Bsdfasdf",
        grinder_setting: "1.8",
        dose_amount_grams: 32,
        brew_amount_grams: 12,
        brew_time_seconds: 36,
        bitter_sour: "+33 (bitter)",
        issues: "",
        id: 2,
        timestamp: new Date("2019-06-19 11:32")
    },
    {
        roaster: "Counter culture",
        bean: "Csfsdf",
        grinder_setting: "1.8",
        dose_amount_grams: 31,
        brew_amount_grams: 13,
        brew_time_seconds: 37,
        bitter_sour: "+1 (bitter)",
        issues: "",
        id: 3,
        timestamp: new Date("2019-06-19 11:34")
    },
    {
        roaster: "Counter culture",
        bean: "Csfsdf",
        grinder_setting: "1.8",
        dose_amount_grams: 32,
        brew_amount_grams: 23,
        brew_time_seconds: 37,
        bitter_sour: "0",
        issues: "",
        id: 4,
        timestamp: new Date("2019-06-19 11:36")
    },
    {
        roaster: "Counter culture",
        bean: "Csfsdf",
        grinder_setting: "1.8",
        dose_amount_grams: 23,
        brew_amount_grams: 21,
        brew_time_seconds: 37,
        bitter_sour: "0",
        issues: "",
        id: 5,
        timestamp: new Date("2019-06-19 11:36")
    },
    {
        roaster: "Counter culture",
        bean: "Csfsdf",
        grinder_setting: "1.8",
        dose_amount_grams: 23,
        brew_amount_grams: 22,
        brew_time_seconds: 37,
        bitter_sour: "0",
        issues: "",
        id: 6,
        timestamp: new Date("2019-06-19 11:36")
    },
    {
        roaster: "Counter culture",
        bean: "Csfsdf",
        grinder_setting: "1.8",
        dose_amount_grams: 32,
        brew_amount_grams: 21,
        brew_time_seconds: 37,
        bitter_sour: "0",
        issues: "",
        id: 7,
        timestamp: new Date("2019-06-19 11:36")
    },
    {
        roaster: "Counter culture",
        bean: "Csfsdf",
        grinder_setting: "1.8",
        dose_amount_grams: 32,
        brew_amount_grams: 21.4,
        brew_time_seconds: 37,
        bitter_sour: "0",
        issues: "",
        id: 8,
        timestamp: new Date("2019-06-19 11:36")
    }
];

module.exports.issues = [
    "Spritzers",
    "Extraction too fast",
    "Extraction too slow"
];