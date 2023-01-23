import { AccessToken, logout } from "contexts/helpers";
import { axiosInstance, errorHelper, generateSuccess } from "./axiosInstance";

class API {
  displayAccessToken() {
    console.log(AccessToken);
  }

  /**
   * @author Sanchit Dang
   * @description Login API endpoint
   * @param {Object} loginDetails Login details for the user
   * @returns {Object} responseObject
   */
  login(loginDetails) {
    return axiosInstance
      .post("user/login", loginDetails)
      .then((response) => {
        return generateSuccess(response.data.data.accessToken);
      })
      .catch((error) => errorHelper(error, "login"));
  }

  getUserRole() {
    return axiosInstance
      .post(
        "accessTokenLogin",
        {},
        {
          headers: {
            authorization: "Bearer " + AccessToken,
          },
        }
      )
      .then((response) => generateSuccess(response.data.data))
      .catch((error) => errorHelper(error));
  }

  /**
   * @author Sanchit Dang
   * @description AccessToken Login API endpoint
   * @returns {Object} responseObject
   */
  accessTokenLogin() {
    return axiosInstance
      .post(
        "accessTokenLogin",
        {},
        {
          headers: {
            authorization: "Bearer " + AccessToken,
          },
        }
      )
      .then(() => generateSuccess(AccessToken))
      .catch((error) => errorHelper(error));
  }

  /**
   * @author Sanchit Dang
   * @description logoutUser Login API endpoint
   * @returns {Promise<Object>} responseObject
   */
  async logoutUser() {
    return axiosInstance
      .put(
        "user/logout",
        {},
        {
          headers: {
            authorization: "Bearer " + AccessToken,
          },
        }
      )
      .then(() => {
        logout();
        return generateSuccess(true);
      })
      .catch((error) => errorHelper(error));
  }

  /**
   * @author Sanchit Dang
   * @param {Object} data
   * @param {String} data.ssoToken
   * @param {Object} data.deviceData
   * @param {String} data.deviceData.deviceName
   * @param {String} data.deviceData.deviceType
   * @param {String} data.deviceData.deviceUUID
   * @returns {Promise<Object>}
   */
  async authenticateSSO(data) {
    return axiosInstance
      .post(`sso/auth/validate`, data)
      .then((response) => generateSuccess(response.data.data))
      .catch((error) => errorHelper(error));
  }

  /**
   *
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async register(data) {
    return axiosInstance
      .post(`user/register`, data)
      .then((response) => generateSuccess(response.data.data))
      .catch((error) => errorHelper(error));
  }

  getUsers() {
    return axiosInstance
      .get("admin/getUser", {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
  }

  getService() {
    return axiosInstance
      .get("service/getService", {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
  }

  getUserProfile() {
    return axiosInstance
      .get("user/getUserProfile", {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
  }

  getSignedLogicSig() {
    return axiosInstance
      .get("user/getSignedLogicSig", {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
  }

  setSignedLogicSig(data) {
    return axiosInstance
      .put("user/setSignedLogicSig", data, {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then((response) => {
        return generateSuccess(response.data);
      })
      .catch((error) => errorHelper(error));
  }

  editUserProfile(data){
    return axiosInstance
      .put("user/profile", data,{
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
    
  }
  
  getDevelopers() {
    return axiosInstance
      .get("user/developerProfiles", {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
  }

  createService(data) {
    return axiosInstance
      .post("service/createService", data, {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then(() => generateSuccess(AccessToken))
      .catch((error) => errorHelper(error));
  }
  createJob(data) {
    return axiosInstance
      .post("job/createJob", data, {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then(() => generateSuccess(AccessToken))
      .catch((error) => errorHelper(error));
  }
  getJob() {
    return axiosInstance
      .get("job/getJobs", {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
  }
  getDatasets() {
    return axiosInstance
      .get("data/getDataEntries", {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
  }
  /**
   * 
   * @param {FormData} data document file as form-data
   * @returns {Object} responseObj
   */
  async uploadDocument(data) {
    return await axiosInstance
      .post("upload/uploadDocument", data, {
        headers: {
          "Content-Type": "multipart/form-data; boundary='boundary'",
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
  }

  /**
   * 
   * @param {FormData} data image file as form-data
   * @returns {Object} responseObj
   */
  async uploadImage(data) {
    return await axiosInstance
      .post("upload/uploadImage", data, {
        headers: {
          "Content-Type": "multipart/form-data; boundary='boundary'",
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
  }

  createDataEntry(data) {
    return axiosInstance
      .post("data/createDataEntry", data, {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then(() => generateSuccess(AccessToken))
      .catch((error) => errorHelper(error));
  }
}
const instance = new API();
export default instance;
