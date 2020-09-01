const axios = require("axios");
const fs = require("fs");

// config
const cookies =
  "_ga=GA1.3.1508858433.1596425083; SPUsageId=b9e00243-61c2-48ef-a557-9428d8436a3b; _gid=GA1.3.1420588977.1598839849; FedAuth=77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48U1A+MCMuZnxsZGFwbWVtYmVyfHRvZHN1cHBvcnQubXN0LDAjLmZ8bGRhcG1lbWJlcnx0b2RzdXBwb3J0Lm1zdCwxMzI0MzgyMTQyMjg3NjE0MTMsVHJ1ZSxKM2dCN3VxTGM2T2dVVTJxU0N1dmtmZjNwWTdYMDFuRVFxOVUrWkV3QzhVcmhhTDhRQ2lEclZ0RUtQWEtvZXlwZUxvWlZmcG9tbyt0SXcrcFFmc0lEMUE3R1NyK3JXV28wWXhhR3k1dUxjWEw3SksvcWlpS0Rsa1JwRis3dUZreXdYOWtIWUhiVENZdU4rcmZwdTc5UE5zWVdiQnR2MHQ4aDJuaEc2UFRhdk5oMlRHZjlJejB4UFJZa0hGZzJUcEdrL0hlclJWWlAzaWlzRzFNVEVnL2h6YzR4SFdaVzFsWEtpNWZiYVQxRmU2U0dPYnJ6S2diRzZNS3ZpRE5vTndkaVQyNzhtTm1SVjIvdHltdzYrM3hFeXRsWGU4NWNMSW9uMFhEYityWHJoTG9TcnFHRDFjLzRJQ05iV3dwK1ZzSUs0d1BSNlpxQmgzQlFGZDEvN21mV0E9PSxodHRwOi8vcG9ydGFsLnRyYWtpbmRvLmNvLmlkL19sYXlvdXRzLzE1L1RyYWtpbmRvL0F1dGhlbnRpY2F0aW9uL0xvZ2luLmFzcHg/bG9nb3V0PTEmYW1wO3JlYXNvbj0zPC9TUD4=; sp=QbHXY8f9lL/3spy9DIS+7A==; spPass=NuZQzlnOnlLbxGj2WP2CGw==; spId=2975576; _gat=1; .AspNetCore.Session=CfDJ8F0jlBWYXpRBq1Hum668BlQISvmVcjjcv2uCjyyluX1wAeeOhya7nETOGvMXyvN6kgR2NyRzMY9cZ8SxT1FbMoTUgCF2ey3OFQqLix8wn%2FFMDb3eQf6AROXIZ46K%2BgV1Yn05Ys5Mp06Ez6vXox3Mu6o6ixpxlsx8uTULDb1dnv8a";
const host = "https://tod-api.trakindo.co.id/api/service/";
const urls = [
  "serviceRequest",
  "quotation",
  "readyToExecute",
  "serviceRequestWip",
  "jobComplete",
];
const interval = 300000; //ms 5m
const timeout = 120;
const token = "";

setInterval(() => {
  urls.forEach((urlItem) => {
    const api = { endpoint: host + urlItem, method: "GET", data: {} };
    const req = request(api, { page: 1, areaCode: "ALL" });
    req
      .then((reqStart) => writeFile(urlItem, reqStart))
      .catch((reqStart) => writeFile(urlItem, reqStart, "Failed"));
  });
}, interval);

/**
 * write log to file
 * @param {*} url
 * @param {*} reqStart
 * @param {*} status
 */
function writeFile(url, reqStart, status = "Success") {
  let file = "";
  switch (url) {
    case "quotation":
      file =
        status == "Success" ? "quotation/success.log" : "quotation/error.log";
      break;
    case "readyToExecute":
      file =
        status == "Success"
          ? "readyToExecute/success.log"
          : "readyToExecute/error.log";
      break;
    case "serviceRequestWip":
      file =
        status == "Success"
          ? "serviceRequestWip/success.log"
          : "serviceRequestWip/error.log";
      break;
    case "jobComplete":
      file =
        status == "Success"
          ? "jobComplete/success.log"
          : "jobComplete/error.log";
      break;
    default:
      file =
        status == "Success"
          ? "serviceRequest/success.log"
          : "serviceRequest/error.log";
      break;
  }

  const reqComplete = new Date();
  const duration = parseInt(reqComplete.getTime() - reqStart.getTime());
  fs.appendFile(
    file,
    `${status} [start]: ${reqStart.toString()} [duration]: ${convertDuration(
      duration
    )}\n`,
    "UTF-8",
    () => console.log(`writed: ${new Date().toString()}`)
  );
}

/**
 *
 * @param {*} time
 */
function convertDuration(time) {
  if (time < 1000) {
    return `${time} ms`;
  } else {
    return time / 1000 + " s";
  }
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

  let reqStart = new Date();
  return new Promise((resolve, reject) => {
    axios(axiosConfig)
      .then((response) => {
        const body = response.data;
        resolve(reqStart);
      })
      .catch((err) => {
        reject(reqStart);
      });
  });
}
