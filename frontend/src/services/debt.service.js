import API from './api';

class DebtService {
  // Mock debts data - in production, this would come from the backend
  mockDebts = [
    { id: 1, customerId: 1, customerName: 'Trần Thị Lan', roomId: 1, amount: 450000, type: 'utilities', description: 'Tiền điện nước tháng 4', date: '2024-05-01', status: 'overdue' },
    { id: 2, customerId: 2, customerName: 'Nguyễn Văn An', roomId: 2, amount: 200000, type: 'fine', description: 'Phạt vi phạm nội quy (tiếng ồn)', date: '2024-04-28', status: 'overdue' },
    { id: 3, customerId: 3, customerName: 'Phạm Thị Hoa', roomId: 1, amount: 300000, type: 'utilities', description: 'Tiền nước tháng 3', date: '2024-04-15', status: 'pending' },
  ];

  getAllDebts() {
    // Simulated API call
    return Promise.resolve(this.mockDebts);
  }

  getDebtsByCustomer(customerId) {
    return Promise.resolve(this.mockDebts.filter(d => d.customerId === customerId));
  }

  markDebtAsPaid(debtId) {
    const debt = this.mockDebts.find(d => d.id === debtId);
    if (debt) {
      debt.status = 'paid';
    }
    return Promise.resolve(debt);
  }
}

export default new DebtService();
