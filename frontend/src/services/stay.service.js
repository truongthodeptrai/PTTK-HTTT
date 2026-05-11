import API from './api';

class StayService {
  getAllStays() {
    return API.get('/stays').then((res) => res.data.data);
  }

  getStayById(id) {
    return API.get(`/stays/${id}`).then((res) => res.data.data);
  }
}

export default new StayService();
