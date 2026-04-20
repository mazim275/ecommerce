// src/components/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  UsersIcon,
  PackageIcon,
  BarChart3Icon,
  LogOutIcon,
  HomeIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
  UploadCloudIcon,
  RefreshCwIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";



const NEON = {
  accent1: "#7C3AED", // purple
  accent2: "#06B6D4", // teal
  accent3: "#06D6A0", // greenish
  accent4: "#FF6B6B", // pink/red
  bg: "#04060a",
};

const COLORS = ["#7C3AED", "#06B6D4", "#06D6A0", "#FF6B6B", "#F59E0B"];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard"); // dashboard | users | products | orders | profile
  const [loading, setLoading] = useState(false);

  const [adminInfo, setAdminInfo] = useState({ name: "", email: "", profilePic: "" });
  const [stats, setStats] = useState({
    salesTimeseries: [],
    ordersByDay: [],
    userRegistrations: [],
    productCounts: [],
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

 useEffect(() => {
  const stored = localStorage.getItem("admin");
  if (stored) {
    const obj = JSON.parse(stored);
    setAdminInfo({
      name: obj.name || "",
      email: obj.email || "",
      profilePic: obj.profilePic || "",
    });
  } else {
    console.warn("Admin info not found in localStorage");
  }

  fetchAll();
}, []);


  async function fetchAll() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const resStats = await axios.get("http://localhost:3000/api/admin/stats", { headers });
        if (resStats?.data) setStats((s) => ({ ...s, ...resStats.data }));
      } catch (err) {
      }

      const [uRes, pRes, oRes] = await Promise.all([
        axios.get("http://localhost:3000/api/users", { headers }),
        axios.get("http://localhost:3000/api/products", { headers }),
        axios.get("http://localhost:3000/api/orders", { headers }),
      ]);

      if (uRes?.data) setUsers(uRes.data);
      if (pRes?.data) setProducts(pRes.data);
      if (oRes?.data) setOrders(oRes.data);

      // Fallback stats builders (if not provided by /admin/stats)
      setStats((prev) => {
        const next = { ...prev };
        if (!next.salesTimeseries || next.salesTimeseries.length === 0) {
          next.salesTimeseries = (oRes?.data || [])
            .slice(-30)
            .map((o) => ({ day: new Date(o.createdAt || Date.now()).toLocaleDateString(), revenue: o.totalAmount || 0 }));
        }
        if (!next.ordersByDay || next.ordersByDay.length === 0) {
          const byDay = {};
          (oRes?.data || []).forEach((o) => {
            const d = new Date(o.createdAt || Date.now()).toLocaleDateString();
            byDay[d] = (byDay[d] || 0) + 1;
          });
          next.ordersByDay = Object.entries(byDay).map(([day, count]) => ({ day, count }));
        }
        if (!next.userRegistrations || next.userRegistrations.length === 0) {
          next.userRegistrations = (uRes?.data || []).map((u) => ({ name: u.name || u.email, joined: new Date(u.createdAt || Date.now()).toLocaleDateString() }));
        }
        if (!next.productCounts || next.productCounts.length === 0) {
          next.productCounts = (pRes?.data || []).map((p) => ({ name: p.name, value: 1 }));
        }
        return next;
      });
    } catch (error) {
      console.error("fetchAll error:", error);
    } finally {
      setLoading(false);
    }
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }

  // Profile picture upload
  async function handleProfileUpload(file) {
    if (!file) return;
    setUploading(true);
    setProfilePicPreview(URL.createObjectURL(file));
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("profile", file);

      const res = await axios.post("http://localhost:3000/api/admin/uploadprofile", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (res.data) {
        const updated = res.data;
        setAdminInfo((p) => ({ ...p, ...updated }));
        const stored = JSON.parse(localStorage.getItem("admin") || "{}");
        localStorage.setItem("admin", JSON.stringify({ ...stored, ...updated }));
      }
    } catch (err) {
      console.error("upload profile error:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  // delete user
  async function handleRemoveUser(userId) {
    if (!confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((u) => u.filter((x) => x._id !== userId));
    } catch (err) {
      console.error("delete user error:", err);
      alert("Failed to delete user");
    }
  }

  // helpers
  const revenueData = stats.salesTimeseries || [];
  const ordersData = stats.ordersByDay || [];
  const userData = (stats.userRegistrations || []).slice(0, 10);

  // UI components
  function DashboardView() {
    return (
      <div className="w-full">
        {/* top stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#041014] to-[#041018] border border-[#0f172a] p-6 rounded-2xl shadow-[0_10px_30px_rgba(6,182,212,0.06)]">
            <h4 className="text-xs text-gray-400">Total Users</h4>
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-3xl font-bold text-[#06B6D4]">{users.length}</p>
                <p className="text-sm text-gray-500">Registered users</p>
              </div>
              <UsersIcon className="w-10 h-10 text-[#06B6D4]" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#07030a] to-[#141018] border border-[#200b29] p-6 rounded-2xl shadow-[0_10px_30px_rgba(124,58,237,0.06)]">
            <h4 className="text-xs text-gray-400">Total Products</h4>
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-3xl font-bold text-[#7C3AED]">{products.length}</p>
                <p className="text-sm text-gray-500">Active products</p>
              </div>
              <PackageIcon className="w-10 h-10 text-[#7C3AED]" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#100b06] to-[#19120a] border border-[#2a0b0b] p-6 rounded-2xl shadow-[0_10px_30px_rgba(255,107,107,0.06)]">
            <h4 className="text-xs text-gray-400">Total Orders</h4>
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-3xl font-bold text-[#06D6A0]">{orders.length}</p>
                <p className="text-sm text-gray-500">Placed orders</p>
              </div>
              <BarChart3Icon className="w-10 h-10 text-[#06D6A0]" />
            </div>
          </div>
        </div>

        {/* charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#041018] border border-[#0f172a] p-6 rounded-2xl">
            <h4 className="text-lg font-semibold mb-4 text-[#c7f9f9]">Sales (recent)</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#0b1220", borderRadius: 6 }} />
                  <Line type="monotone" dataKey="revenue" stroke={NEON.accent2} strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#081014] border border-[#0f172a] p-6 rounded-2xl">
            <h4 className="text-lg font-semibold mb-4 text-[#f1f5f9]">Orders by day</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersData}>
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#06111a", borderRadius: 6 }} />
                  <Bar dataKey="count" fill={NEON.accent3} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* lower grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-[#041018] border border-[#0f172a] p-6 rounded-2xl">
            <h4 className="text-lg font-semibold mb-4 text-[#e6f9f2]">Top Products</h4>
            <div className="h-48 overflow-auto space-y-3">
              {(products || []).slice(0, 8).map((p) => (
                <div key={p._id} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-400">₹{p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#041018] border border-[#0f172a] p-6 rounded-2xl">
            <h4 className="text-lg font-semibold mb-4 text-[#e6f9f2]">User Registrations</h4>
            <ul className="space-y-2">
              {userData.map((u, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-gray-400">{u.joined}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#041018] border border-[#0f172a] p-6 rounded-2xl">
            <h4 className="text-lg font-semibold mb-4 text-[#e6f9f2]">Product Distribution</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.productCounts || []} dataKey="value" nameKey="name" outerRadius={70} label>
                    {(stats.productCounts || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function UsersView() {
    return (
      <div className="bg-[#041018] border border-[#0f172a] p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Registered Users</h3>
          <div className="flex items-center gap-2">
            <input className="border rounded px-3 py-1 bg-transparent text-white placeholder-gray-400" placeholder="Search users..." />
          </div>
        </div>

        <div className="space-y-3">
          {users.map((u) => (
            <div key={u._id} className="flex items-center justify-between p-3 border rounded border-[#0f172a]">
              <div>
                <div className="font-medium text-white">{u.name}</div>
                <div className="text-sm text-gray-400">{u.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => alert("Open profile " + u._id)} className="text-sm px-3 py-1 rounded bg-[#0f172a] text-[#06B6D4]">View</button>
                <button onClick={() => handleRemoveUser(u._id)} className="text-sm px-3 py-1 rounded bg-[#2b0f0f] text-[#FF6B6B]">Delete</button>
              </div>
            </div>
          ))}
          {users.length === 0 && <div className="text-gray-500">No users found.</div>}
        </div>
      </div>
    );
  }

  function ProductsView() {
    return (
      <div className="bg-[#041018] border border-[#0f172a] p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Products</h3>
          <button onClick={() => navigate("/addproduct")} className="text-sm px-4 py-2 rounded bg-[#06B6D4] text-black">Add Product</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p._id} className="flex items-center gap-4 border rounded p-3 border-[#0f172a]">
              <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded" />
              <div>
                <div className="font-medium text-white">{p.name}</div>
                <div className="text-sm text-gray-400">₹{p.price}</div>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="text-sm px-3 py-1 rounded bg-[#191a22] text-[#FBBF24]">Edit</button>
                <button className="text-sm px-3 py-1 rounded bg-[#2b0f0f] text-[#FF6B6B]">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function OrdersView() {
    return (
      <div className="bg-[#041018] border border-[#0f172a] p-6 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="flex items-center justify-between p-3 border rounded border-[#0f172a]">
              <div>
                <div className="font-medium text-white">Order #{o._id.slice(-6)}</div>
                <div className="text-sm text-gray-400">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#06D6A0]">₹{o.totalAmount}</div>
                <div className="text-sm text-gray-400">{o.status}</div>
              </div>
            </div>
          ))}
          {orders.length === 0 && <div className="text-gray-500">No orders found</div>}
        </div>
      </div>
    );
  }

  function ProfileView() {
    return (
      <div className="bg-[#041018] border border-[#0f172a] p-6 rounded-2xl max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-white">Admin Profile</h3>

        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#7C3AED]">
            <img src={profilePicPreview || adminInfo.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Profile" className="w-full h-full object-cover" />
          </div>

          <div className="flex-1">
            <div className="font-medium text-white">{adminInfo.name || "Admin Name"}</div>
            <div className="text-sm text-gray-400">{adminInfo.email || "admin@example.com"}</div>

            <label className="mt-3 inline-flex items-center gap-2 cursor-pointer bg-[#7C3AED] text-white px-3 py-2 rounded">
              <UploadCloudIcon className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload Photo"}
              <input type="file" accept="image/*" onChange={(e) => handleProfileUpload(e.target.files[0])} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#02020a] text-white">
      {/* SIDEBAR */}
      <aside className={`transition-all ${collapsed ? "w-20" : "w-72"} bg-gradient-to-b from-[#03030a] to-[#02020a] border-r border-[#0b1220] p-4`}>
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] w-12 h-12 rounded flex items-center justify-center font-bold text-black shadow-[0_6px_20px_rgba(124,58,237,0.25)]">
                AD
              </div>
              <div>
                <div className="font-semibold">{adminInfo.name || "Admin"}</div>
                <div className="text-xs text-gray-400">{adminInfo.email}</div>
              </div>
            </div>
          )}

          <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded bg-[#060814]">
            {collapsed ? <MenuIcon className="w-5 h-5 text-[#7C3AED]" /> : <XIcon className="w-4 h-4 text-[#06B6D4]" />}
          </button>
        </div>

        <nav className="space-y-2">
          <button onClick={() => setActive("dashboard")} className={`w-full flex items-center gap-3 p-3 rounded ${active === "dashboard" ? "bg-gradient-to-r from-[#071422] to-[#071427] border-l-4 border-[#06B6D4]" : "hover:bg-[#061120]"} `}>
            <HomeIcon className="w-5 h-5 text-[#06B6D4]" />
            {!collapsed && <span>Dashboard</span>}
          </button>

          <button onClick={() => setActive("users")} className={`w-full flex items-center gap-3 p-3 rounded ${active === "users" ? "bg-gradient-to-r from-[#071422] to-[#071427] border-l-4 border-[#7C3AED]" : "hover:bg-[#061120]"}`}>
            <UsersIcon className="w-5 h-5 text-[#7C3AED]" />
            {!collapsed && <span>Users</span>}
          </button>

          <button onClick={() => setActive("products")} className={`w-full flex items-center gap-3 p-3 rounded ${active === "products" ? "bg-gradient-to-r from-[#071422] to-[#071427] border-l-4 border-[#06D6A0]" : "hover:bg-[#061120]"}`}>
            <PackageIcon className="w-5 h-5 text-[#06D6A0]" />
            {!collapsed && <span>Products</span>}
          </button>

          <button onClick={() => setActive("orders")} className={`w-full flex items-center gap-3 p-3 rounded ${active === "orders" ? "bg-gradient-to-r from-[#071422] to-[#071427] border-l-4 border-[#FF6B6B]" : "hover:bg-[#061120]"}`}>
            <BarChart3Icon className="w-5 h-5 text-[#FF6B6B]" />
            {!collapsed && <span>Orders</span>}
          </button>

          <button onClick={() => setActive("profile")} className={`w-full flex items-center gap-3 p-3 rounded ${active === "profile" ? "bg-gradient-to-r from-[#071422] to-[#071427] border-l-4 border-[#7C3AED]" : "hover:bg-[#061120]"}`}>
            <PackageIcon className="w-5 h-5 text-[#94a3b8]" />
            {!collapsed && <span>Profile</span>}
          </button>

          <div className="mt-6">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded hover:bg-[#1b0b0b] text-[#FF6B6B]">
              <LogOutIcon className="w-5 h-5" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 p-8">
        {/* top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <div className="text-sm text-gray-400">Cyber Neon • Analytics</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#06111a] border border-[#0f172a]">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>

            <button onClick={() => { setActive("dashboard"); navigate("/"); }} className="flex items-center gap-2 px-3 py-2 rounded bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] text-black font-semibold shadow">
              <HomeIcon className="w-4 h-4" /> Home
            </button>

            <button onClick={() => fetchAll()} className="flex items-center gap-2 px-3 py-2 rounded bg-[#0b1220] border border-[#17233a]">
              <RefreshCwIcon className="w-4 h-4 text-[#7C3AED]" /> Refresh
            </button>

            <button onClick={() => setActive("profile")} className="bg-[#071422] px-3 py-2 rounded">Profile</button>
          </div>
        </div>

        {/* content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : (
            <>
              {active === "dashboard" && <DashboardView />}
              {active === "users" && <UsersView />}
              {active === "products" && <ProductsView />}
              {active === "orders" && <OrdersView />}
              {active === "profile" && <ProfileView />}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
