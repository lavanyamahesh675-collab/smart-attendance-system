import api from './api';

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    console.warn("Backend API not reachable or returned error. Checking demo fallback credentials...", error);
  }

  // Demo Fallback Authentication (Ensures zero-friction lab demo login even if backend server is starting)
  const u = username.trim().toLowerCase();
  const p = password.trim();

  let userRole = null;
  let fullName = '';
  let studentId = null;
  let facultyId = null;

  if (u === 'admin' && p === 'Admin@123') {
    userRole = 'ROLE_ADMIN';
    fullName = 'System Administrator';
  } else if ((u === 'faculty' || u === 'fac_amit') && p === 'Faculty@123') {
    userRole = 'ROLE_FACULTY';
    fullName = 'Dr. Amit Sharma';
    facultyId = 1;
  } else if ((u === 'student' || u === 'stu_rahul' || u === 'stu1001') && p === 'Student@123') {
    userRole = 'ROLE_STUDENT';
    fullName = 'Rahul Kumar';
    studentId = 1;
  }

  if (userRole) {
    const demoData = {
      token: "demo_jwt_token_" + Date.now(),
      type: "Bearer",
      id: userRole === 'ROLE_ADMIN' ? 1 : userRole === 'ROLE_FACULTY' ? 2 : 3,
      username: u,
      email: `${u}@bioattend.edu`,
      fullName: fullName,
      role: userRole,
      phone: "+91 98765 43210",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u}`,
      studentId: studentId,
      facultyId: facultyId,
      departmentName: "Computer Science & Engineering"
    };

    localStorage.setItem('token', demoData.token);
    localStorage.setItem('user', JSON.stringify(demoData));
    return demoData;
  }

  throw new Error("Invalid username or password. Please use admin / Admin@123, faculty / Faculty@123, or student / Student@123.");
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};
