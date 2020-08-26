const axios = require("axios");
const fs = require("fs");

// config
const cookies =
  "_ga=GA1.3.92820565.1596426578; SPUsageId=1ae08f04-3f64-4566-a4f2-31e20bb13913; _gid=GA1.3.444622237.1598457632; FedAuth=77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48U1A+MCMuZnxsZGFwbWVtYmVyfHRvZHN1cHBvcnQubXN0LDAjLmZ8bGRhcG1lbWJlcnx0b2RzdXBwb3J0Lm1zdCwxMzI0MzM2MzI5MjEyNDI0MDYsVHJ1ZSxqOHpLSmpTQVlEeWI3blladEhhN2RJUk5qU3hKcXhuUEpFc2NkOStDQ2RUd2g3dUhkTEJVT3hRWENHSDJhZmFHNEZXVnpnYnA1ckhJd0xZUUxta3pSZGhWa0dwaVBhaDlabjZvR3dkUUVlTFBLNmk1ZStxQWtGN0orVUlTOGtRT3lZNy9nSkpyVkE4eEFOZUNmN3B1MG1WSjVMOVJKMGRML3ZWdGhPZWRHd0h1eFJpY1BFUXFtVVpZSjkxRGdiajYxS1BtOUhoclRrbDF4cDR4K1VhUWtuNjlZcFVLbXJIZjZWRHlvNmw0bHh4T1d1eGUrTG05OWJyeFBGVWs3cjY5OW1CMWZ2b203T1lwWUtzelVwWXA0OWZkQU0yNmlEeGpHbzBiUWZMam0rUkpXSjM3T21TUWw3c2ZZZUxKQnMzeXNnM2cyR1l3Y2lmSExXTHljRHhzNXc9PSxodHRwOi8vcG9ydGFsLnRyYWtpbmRvLmNvLmlkL19sYXlvdXRzLzE1L1RyYWtpbmRvL0F1dGhlbnRpY2F0aW9uL0xvZ2luLmFzcHg/UmV0dXJuVXJsPS9fbGF5b3V0cy8xNS9BdXRoZW50aWNhdGUuYXNweD9Tb3VyY2U9JTI1MkYmYW1wO1NvdXJjZT0vPC9TUD4=; sp=QbHXY8f9lL/3spy9DIS+7A==; spPass=NuZQzlnOnlLbxGj2WP2CGw==; spId=2957292; .AspNetCore.Session=CfDJ8C1k0eKKxIxOrFiNmveedC75kNPfAkoGsq7Ra72C29hvvq50fU4yRDdI6V9K4yfKXFdo66ZxdtWP7BlD1xGWDcl%2BUc78eGn5sUjxfwNud4pJ4IxPvlss1HDKitXan34A4XCWSBv8oArKGTgriu9HMq%2BDrWuoXguH7K2NqYVJwhos; _gat=1";
const url = "https://tod-api.trakindo.co.id/api/service/quotation";
const api = { endpoint: url, method: "GET", data: {} };
const interval = 300000; //ms 5m
const timeout = 30;
const token = "";

// init
writeFile(true);

setInterval(() => {
  const req = request(api, { page: 1, areaCode: "ALL" }, null);
  const dt = new Date();
  const reqStart = dt.toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  req
    .then(() =>
      console.log(
        `Success: ${new Date().toLocaleString("en-US", {
          timeZone: "Asia/Jakarta",
        })}`
      )
    )
    .catch((e) => {
      writeFile(false, reqStart);
    });
}, interval);

/**
 * write log to file
 * @param {*} begin
 * @param {*} reqStart
 */
// write file
function writeFile(begin = false, reqStart = null) {
  fs.appendFile(
    "./error.txt",
    begin
      ? `LOG every ${interval / 60000} Minutes -- start\n`
      : `Error: start-> ${reqStart} end-> ${new Date().toLocaleString("en-US", {
          timeZone: "Asia/Jakarta",
        })}\n`,
    "UTF-8",
    () =>
      console.log(
        `Error: ${new Date().toLocaleString("en-US", {
          timeZone: "Asia/Jakarta",
        })}`
      )
  );
}

/**
 * request to endpoint
 * @param {*} api
 * @param {*} param
 */
function request(api, param) {
  const { endpoint, method, data } = api;

  const url = endpoint;
  const params = {
    ...param,
    ...data,
  };

  const headers = {
    // "Content-Type": "application/json",
    Cookie: cookies,
    Authorization: `Bearer ${token}`,
  };

  const axiosConfig = {
    method,
    url,
    headers,
    timeout: timeout * 1000,
  };

  if (method.toUpperCase() === "GET") {
    axiosConfig.params = params;
  } else {
    axiosConfig.data = params;
  }

  return new Promise((resolve, reject) => {
    axios(axiosConfig)
      .then((response) => {
        const body = response.data;
        resolve(body);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
