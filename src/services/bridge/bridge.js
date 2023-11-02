const axios = require("axios");
const { generateJson } = require("../../utils/file");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYXBpIiwibmJmIjoxNjk4ODk5MjE3LCJleHAiOjE2OTg5MzUyMTcsImlzcyI6InRvb2xzNGJyb2tlcnMifQ.ASdjqhR2RxqWFR0_x4vzOssyC65L0rZe3ctONB9EdDI";

const login = async () => {
  try {
    const url = "https://motfx.tp.t4b.com:82/api/Auth/Login";
    const body = {
      username: "api",
      password: "123qweASDMotForex2#23",
    };

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(url, body, headers);
    console.log(response.data.JWT);
  } catch (error) {}
};

const getPositions = async () => {
  try {
    const url =
      "https://motfx.tp.t4b.com:82/api/Mt5/GetDealsData?query.platformName=MT5%20Live&query.from=2023-11-01%2000%3A00%3A00&query.to=2023-11-01%2023%3A59%3A59";

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(url, headers);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

getPositions().then((res) => {
  console.log("res");
});
