import API from './api';

class RoomService {
  getAllRooms() {
    return API.get('/rooms').then((res) => res.data.data);
  }

  getAvailableRooms() {
    return API.get('/rooms/available').then((res) => res.data.data);
  }

  getRoomById(id) {
    return API.get(`/rooms/${id}`).then((res) => res.data.data);
  }

  getBedsByRoom(id) {
    return API.get(`/rooms/${id}/beds`).then((res) => res.data.data);
  }

  createRoom(room) {
    return API.post('/rooms', room).then((res) => res.data.data);
  }

  updateRoom(id, room) {
    return API.put(`/rooms/${id}`, room).then((res) => res.data.data);
  }
}

export default new RoomService();
