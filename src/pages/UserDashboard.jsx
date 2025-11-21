const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container mt-5">
      <h1>👤 User Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
    </div>
  );
};

export default UserDashboard;
