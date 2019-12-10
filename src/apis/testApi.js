import Axios from "axios";

export default {
  test:function () {
    return Axios.get('/try/ajax/json_demo.json');
  }
}
