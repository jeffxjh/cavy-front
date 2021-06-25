import axios from "axios";

const ApiService = {
  async query(resource, params) {
    return axios
      .get(resource, params)
      .then(res => {
        console.log(res);

        console.log("ok");
      })
      .catch(err => {
        console.log(err);
      });
  }
};

export default ApiService;

export const MenuService = {
  list(params) {
    return ApiService.query("/menu/list", {
      params: params
    });
  },
  tree(params) {
    return ApiService.query("/menu/tree", {
      params: params
    });
  }
};
