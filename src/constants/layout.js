class MenuItem {
  /**
   *
   * @param {Object} data
   * @param {String} data.name
   * @param {String} data.type
   * @param {String} data.icon
   * @param {String} data.helpingAttribute
   * @param {String} data.customTitle
   * @param {boolean} data.isFavourite
   */
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.icon = data.icon;
    this.helpingAttribute = data.helpingAttribute;
    this.customTitle = data.customTitle;
    this.isFavourite = data.isFavourite;
  }
}

class Layout {
  constructor() {
    this.landingPage = "/home";
    this.menuItems = {
      DEFAULT: [
        new MenuItem({
          name: "Home",
          type: "button",
          icon: "ant-design:home-filled",
          helpingAttribute: "/home",
          customTitle: false,
          isFavourite: true,
        }),
        new MenuItem({
          name: "Profile",
          type: "button",
          icon: "carbon:user-profile",
          helpingAttribute: "/profile",
          customTitle: "Profile",
          isFavourite: true,
        }),
        new MenuItem({
          name: "Developers",
          type: "button",
          icon: "gis:globe-users",
          helpingAttribute: "/developers",
          customTitle: "Developers",
          isFavourite: true,
        }),
        new MenuItem({
          name: "Data Manager",
          type: "button",
          icon: "entypo:code",
          helpingAttribute: "/Datasets",
          customTitle: "Data Manager",
          isFavourite: true,
        }),
        new MenuItem({
          name: "Service Manager",
          type: "button",
          icon: "charm:stack",
          helpingAttribute: "/service",
          customTitle: "Service Manager",
          isFavourite: true,
        }),
        new MenuItem({
          name: "Job Manager",
          type: "button",
          icon: "carbon:task-complete",
          helpingAttribute: "/Job",
          customTitle: "Job Manager",
          isFavourite: true,
        }),
        new MenuItem({
          name: "Logout",
          type: "logout",
          icon: "fe:logout",
          helpingAttribute: "",
          customTitle: "Welcome to Boiler Plate",
          isFavourite: true,
        }),
      ],
    };
    this.header = {
      visibleOnDesktop: true,
      visibleOnMobile: true,
      useCustomColor: false,
      color: "primary",
      customColorCode: "",
    };
    this.bottomMobileNavigation = true;
    this.displayMobileMenuHam = true;
    this.menuButtonLabel = "Menu";
    this.sideMenu = {
      permanent: true,
      default: "open",
    };

    this.defaultContainerSX = {
      backgroundColor: "background.default",
      // display: "flex",
      // flexDirection: "column",
      minHeight: "calc(100% - 124px)",
    };
  }

  /**
   *
   * @param {String} userType
   * @returns {Array<MenuItem>}
   */
  getMenuItems(userType) {
    switch (userType.toLowerCase()) {
      default:
        return this.menuItems.DEFAULT;
    }
  }
}

const instance = new Layout();
export default instance;
