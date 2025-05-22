import DashboardLayout from '@/components/DashboardLayout';

const OrdersPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          {/* Add order list table here */}
          <p>No orders found</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;