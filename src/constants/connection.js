class Connection {
  constructor() {
    this.useAccessTokenVerificationAPI = true;
    this.socket = {
      initSocket: true,
      socketDefaultOptions: {},
      accessTokenVerification: true,
    };
    this.bypassBackend = false;
    this.useDeakinSSO = false;
    this.useACL = false;
  }
}

const instance = new Connection();
export default instance;
