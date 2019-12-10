import Axios from "axios";
Axios.defaults.baseURL = '/api'

export default {
  test:function () {
    return Axios.post('http://www.runoob.com/try/ajax/json_demo.json');
  }
}
