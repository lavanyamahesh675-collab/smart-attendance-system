import api from './api';

// Extended initial sample students (30+ students across CSE, ECE, ME, EEE)
const initialStudents = [
  { id: 1, studentId: "STU1001", rollNo: "2101001", fullName: "Rahul Kumar", email: "student@bioattend.edu", phone: "+91 99887 11100", departmentId: 1, departmentName: "Computer Science & Engineering", courseName: "B.Tech CSE", semester: 6, batch: "2023-2027", attendancePercentage: 88.5, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1001" },
  { id: 2, studentId: "STU1002", rollNo: "2101002", fullName: "Anjali Sharma", email: "stu_anjali@bioattend.edu", phone: "+91 99887 11101", departmentId: 1, departmentName: "Computer Science & Engineering", courseName: "B.Tech CSE", semester: 6, batch: "2023-2027", attendancePercentage: 92.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1002" },
  { id: 3, studentId: "STU1003", rollNo: "2101003", fullName: "Kiran Patel", email: "stu_kiran@bioattend.edu", phone: "+91 99887 11102", departmentId: 1, departmentName: "Computer Science & Engineering", courseName: "B.Tech CSE", semester: 6, batch: "2023-2027", attendancePercentage: 74.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1003" },
  { id: 4, studentId: "STU1004", rollNo: "2101004", fullName: "Rohit Verma", email: "stu_rohit@bioattend.edu", phone: "+91 99887 11103", departmentId: 1, departmentName: "Computer Science & Engineering", courseName: "B.Tech CSE", semester: 6, batch: "2023-2027", attendancePercentage: 85.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1004" },
  { id: 5, studentId: "STU1005", rollNo: "2101005", fullName: "Sneha Gupta", email: "stu_sneha@bioattend.edu", phone: "+91 99887 11104", departmentId: 1, departmentName: "Computer Science & Engineering", courseName: "B.Tech CSE", semester: 6, batch: "2023-2027", attendancePercentage: 95.5, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1005" },
  { id: 6, studentId: "STU1006", rollNo: "2101006", fullName: "Aditya Singh", email: "stu_aditya@bioattend.edu", phone: "+91 99887 11105", departmentId: 1, departmentName: "Computer Science & Engineering", courseName: "B.Tech CSE", semester: 6, batch: "2023-2027", attendancePercentage: 62.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1006" },
  { id: 7, studentId: "STU1007", rollNo: "2101007", fullName: "Pooja Hegde", email: "stu_pooja@bioattend.edu", phone: "+91 99887 11106", departmentId: 1, departmentName: "Computer Science & Engineering", courseName: "B.Tech CSE", semester: 6, batch: "2023-2027", attendancePercentage: 89.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1007" },
  { id: 8, studentId: "STU1008", rollNo: "2101008", fullName: "Varun Dhawan", email: "stu_varun@bioattend.edu", phone: "+91 99887 11107", departmentId: 1, departmentName: "Computer Science & Engineering", courseName: "B.Tech CSE", semester: 6, batch: "2023-2027", attendancePercentage: 78.5, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1008" },
  { id: 9, studentId: "STU1009", rollNo: "2101009", fullName: "Kavya Nair", email: "stu_kavya@bioattend.edu", phone: "+91 99887 11108", departmentId: 1, departmentName: "Computer Science & Engineering", courseName: "B.Tech CSE", semester: 6, batch: "2023-2027", attendancePercentage: 91.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1009" },
  { id: 10, studentId: "STU1010", rollNo: "2101010", fullName: "Manish Pandey", email: "stu_manish@bioattend.edu", phone: "+91 99887 11109", departmentId: 1, departmentName: "Computer Science & Engineering", courseName: "B.Tech CSE", semester: 6, batch: "2023-2027", attendancePercentage: 68.5, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1010" },

  // ECE Department Students
  { id: 11, studentId: "STU1011", rollNo: "2102001", fullName: "Neha Mehta", email: "stu_neha@bioattend.edu", phone: "+91 99887 11110", departmentId: 2, departmentName: "Electronics & Communication Eng.", courseName: "B.Tech ECE", semester: 6, batch: "2023-2027", attendancePercentage: 87.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1011" },
  { id: 12, studentId: "STU1012", rollNo: "2102002", fullName: "Siddharth Roy", email: "stu_sid@bioattend.edu", phone: "+91 99887 11111", departmentId: 2, departmentName: "Electronics & Communication Eng.", courseName: "B.Tech ECE", semester: 6, batch: "2023-2027", attendancePercentage: 93.5, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1012" },
  { id: 13, studentId: "STU1013", rollNo: "2102003", fullName: "Ishita Dutta", email: "stu_ishita@bioattend.edu", phone: "+91 99887 11112", departmentId: 2, departmentName: "Electronics & Communication Eng.", courseName: "B.Tech ECE", semester: 6, batch: "2023-2027", attendancePercentage: 76.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1013" },
  { id: 14, studentId: "STU1014", rollNo: "2102004", fullName: "Gautam Gambhir", email: "stu_gautam@bioattend.edu", phone: "+91 99887 11113", departmentId: 2, departmentName: "Electronics & Communication Eng.", courseName: "B.Tech ECE", semester: 6, batch: "2023-2027", attendancePercentage: 84.5, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1014" },
  { id: 15, studentId: "STU1015", rollNo: "2102005", fullName: "Divya Spandana", email: "stu_divya@bioattend.edu", phone: "+91 99887 11114", departmentId: 2, departmentName: "Electronics & Communication Eng.", courseName: "B.Tech ECE", semester: 6, batch: "2023-2027", attendancePercentage: 64.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1015" },
  { id: 16, studentId: "STU1016", rollNo: "2102006", fullName: "Aakash Chopra", email: "stu_aakash@bioattend.edu", phone: "+91 99887 11115", departmentId: 2, departmentName: "Electronics & Communication Eng.", courseName: "B.Tech ECE", semester: 6, batch: "2023-2027", attendancePercentage: 90.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1016" },

  // ME Department Students
  { id: 17, studentId: "STU1017", rollNo: "2103001", fullName: "Tushar Deshmukh", email: "stu_tushar@bioattend.edu", phone: "+91 99887 11116", departmentId: 3, departmentName: "Mechanical Engineering", courseName: "B.Tech ME", semester: 6, batch: "2023-2027", attendancePercentage: 86.5, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1017" },
  { id: 18, studentId: "STU1018", rollNo: "2103002", fullName: "Ananya Panday", email: "stu_ananya@bioattend.edu", phone: "+91 99887 11117", departmentId: 3, departmentName: "Mechanical Engineering", courseName: "B.Tech ME", semester: 6, batch: "2023-2027", attendancePercentage: 94.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1018" },
  { id: 19, studentId: "STU1019", rollNo: "2103003", fullName: "Harsh Vardhan", email: "stu_harsh@bioattend.edu", phone: "+91 99887 11118", departmentId: 3, departmentName: "Mechanical Engineering", courseName: "B.Tech ME", semester: 6, batch: "2023-2027", attendancePercentage: 71.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1019" },
  { id: 20, studentId: "STU1020", rollNo: "2103004", fullName: "Kunal Kapoor", email: "stu_kunal@bioattend.edu", phone: "+91 99887 11119", departmentId: 3, departmentName: "Mechanical Engineering", courseName: "B.Tech ME", semester: 6, batch: "2023-2027", attendancePercentage: 88.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1020" },
  { id: 21, studentId: "STU1021", rollNo: "2103005", fullName: "Preeti Zinta", email: "stu_preeti@bioattend.edu", phone: "+91 99887 11120", departmentId: 3, departmentName: "Mechanical Engineering", courseName: "B.Tech ME", semester: 6, batch: "2023-2027", attendancePercentage: 92.5, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1021" },

  // EEE Department Students
  { id: 22, studentId: "STU1022", rollNo: "2104001", fullName: "Ritika Singh", email: "stu_ritika@bioattend.edu", phone: "+91 99887 11121", departmentId: 4, departmentName: "Electrical & Electronics Eng.", courseName: "B.Tech EEE", semester: 6, batch: "2023-2027", attendancePercentage: 89.5, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1022" },
  { id: 23, studentId: "STU1023", rollNo: "2104002", fullName: "Yash Gowda", email: "stu_yash@bioattend.edu", phone: "+91 99887 11122", departmentId: 4, departmentName: "Electrical & Electronics Eng.", courseName: "B.Tech EEE", semester: 6, batch: "2023-2027", attendancePercentage: 82.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1023" },
  { id: 24, studentId: "STU1024", rollNo: "2104003", fullName: "Suresh Raina", email: "stu_suresh@bioattend.edu", phone: "+91 99887 11123", departmentId: 4, departmentName: "Electrical & Electronics Eng.", courseName: "B.Tech EEE", semester: 6, batch: "2023-2027", attendancePercentage: 96.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1024" },
  { id: 25, studentId: "STU1025", rollNo: "2104004", fullName: "Tara Sutaria", email: "stu_tara@bioattend.edu", phone: "+91 99887 11124", departmentId: 4, departmentName: "Electrical & Electronics Eng.", courseName: "B.Tech EEE", semester: 6, batch: "2023-2027", attendancePercentage: 61.5, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1025" },
  { id: 26, studentId: "STU1026", rollNo: "2104005", fullName: "Vijay Devarakonda", email: "stu_vijay@bioattend.edu", phone: "+91 99887 11125", departmentId: 4, departmentName: "Electrical & Electronics Eng.", courseName: "B.Tech EEE", semester: 6, batch: "2023-2027", attendancePercentage: 87.5, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1026" },

  // Additional New Enrollments
  { id: 27, studentId: "STU1027", rollNo: "2101011", fullName: "Deepika Padukone", email: "stu_deepika@bioattend.edu", phone: "+91 99887 11126", departmentId: 1, departmentName: "Computer Science & Engineering", courseName: "B.Tech CSE", semester: 6, batch: "2023-2027", attendancePercentage: 93.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1027" },
  { id: 28, studentId: "STU1028", rollNo: "2101012", fullName: "Ranveer Singh", email: "stu_ranveer@bioattend.edu", phone: "+91 99887 11127", departmentId: 1, departmentName: "Computer Science & Engineering", courseName: "B.Tech CSE", semester: 6, batch: "2023-2027", attendancePercentage: 79.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1028" },
  { id: 29, studentId: "STU1029", rollNo: "2102007", fullName: "Kriti Sanon", email: "stu_kriti@bioattend.edu", phone: "+91 99887 11128", departmentId: 2, departmentName: "Electronics & Communication Eng.", courseName: "B.Tech ECE", semester: 6, batch: "2023-2027", attendancePercentage: 91.5, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1029" },
  { id: 30, studentId: "STU1030", rollNo: "2103006", fullName: "Kartik Aaryan", email: "stu_kartik@bioattend.edu", phone: "+91 99887 11129", departmentId: 3, departmentName: "Mechanical Engineering", courseName: "B.Tech ME", semester: 6, batch: "2023-2027", attendancePercentage: 83.0, biometricRegistered: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1030" }
];

const initialFaculty = [
  { id: 1, employeeId: "EMP1001", fullName: "Dr. Amit Sharma", designation: "Professor & HOD", email: "faculty@bioattend.edu", phone: "+91 98765 00001", departmentId: 1, departmentName: "Computer Science & Engineering", joinDate: "2020-08-15", assignedSubjects: ["CS301 Data Structures", "CS303 Java Programming"] },
  { id: 2, employeeId: "EMP1002", fullName: "Dr. Priya Varma", designation: "Associate Professor", email: "priya@bioattend.edu", phone: "+91 98765 00002", departmentId: 1, departmentName: "Computer Science & Engineering", joinDate: "2021-01-10", assignedSubjects: ["CS302 Database Management Systems", "CS304 Operating Systems"] },
  { id: 3, employeeId: "EMP1003", fullName: "Prof. Rajesh Kumar", designation: "Assistant Professor", email: "rajesh@bioattend.edu", phone: "+91 98765 00003", departmentId: 2, departmentName: "Electronics & Communication Eng.", joinDate: "2021-06-20", assignedSubjects: ["EC301 Digital Signal Processing", "EC302 Microcontrollers"] },
  { id: 4, employeeId: "EMP1004", fullName: "Dr. Sunita Rao", designation: "Associate Professor", email: "sunita@bioattend.edu", phone: "+91 98765 00004", departmentId: 3, departmentName: "Mechanical Engineering", joinDate: "2019-11-05", assignedSubjects: ["ME301 Thermodynamics & Heat Transfer"] },
  { id: 5, employeeId: "EMP1005", fullName: "Prof. Vikram Reddy", designation: "Assistant Professor", email: "vikram@bioattend.edu", phone: "+91 98765 00005", departmentId: 4, departmentName: "Electrical & Electronics Eng.", joinDate: "2022-03-12", assignedSubjects: ["EE301 Control Systems & Circuit Theory"] }
];

const departmentMap = {
  1: { name: "Computer Science & Engineering", code: "CSE", course: "B.Tech CSE" },
  2: { name: "Electronics & Communication Eng.", code: "ECE", course: "B.Tech ECE" },
  3: { name: "Mechanical Engineering", code: "ME", course: "B.Tech ME" },
  4: { name: "Electrical & Electronics Eng.", code: "EEE", course: "B.Tech EEE" }
};

// LocalStorage Persistence Helpers
const getStoredStudents = () => {
  const stored = localStorage.getItem('bioattend_students');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('bioattend_students', JSON.stringify(initialStudents));
  return initialStudents;
};

const saveStoredStudents = (students) => {
  localStorage.setItem('bioattend_students', JSON.stringify(students));
};

const getStoredFaculty = () => {
  const stored = localStorage.getItem('bioattend_faculty');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('bioattend_faculty', JSON.stringify(initialFaculty));
  return initialFaculty;
};

const saveStoredFaculty = (faculty) => {
  localStorage.setItem('bioattend_faculty', JSON.stringify(faculty));
};

export const getStudents = async () => {
  try {
    const response = await api.get('/students');
    if (response.data && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // API offline fallback
  }
  return getStoredStudents();
};

export const createStudent = async (data) => {
  const currentStudents = getStoredStudents();
  const deptInfo = departmentMap[data.departmentId] || departmentMap[1];
  
  const newStudent = {
    id: Date.now(),
    studentId: data.studentId || `STU${1000 + currentStudents.length + 1}`,
    rollNo: data.rollNo || `21010${currentStudents.length + 1}`,
    fullName: data.fullName,
    email: data.email || `${data.fullName.toLowerCase().replace(/\s+/g, '')}@bioattend.edu`,
    phone: data.phone || "+91 98765 43210",
    departmentId: Number(data.departmentId),
    departmentName: deptInfo.name,
    courseName: deptInfo.course,
    semester: Number(data.semester || 6),
    batch: data.batch || "2023-2027",
    attendancePercentage: 100.0,
    biometricRegistered: true,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.studentId || data.fullName}`
  };

  try {
    await api.post('/students', data);
  } catch (err) {
    // Ignore offline API
  }

  const updated = [newStudent, ...currentStudents];
  saveStoredStudents(updated);
  return newStudent;
};

export const updateStudent = async (id, data) => {
  const currentStudents = getStoredStudents();
  const deptInfo = departmentMap[data.departmentId] || departmentMap[1];

  const updated = currentStudents.map(s => {
    if (s.id === Number(id)) {
      return {
        ...s,
        ...data,
        departmentName: deptInfo.name,
        courseName: deptInfo.course
      };
    }
    return s;
  });

  saveStoredStudents(updated);

  try {
    await api.put(`/students/${id}`, data);
  } catch (err) {
    // Ignore offline error
  }

  return updated.find(s => s.id === Number(id));
};

export const deleteStudent = async (id) => {
  const currentStudents = getStoredStudents();
  const updated = currentStudents.filter(s => s.id !== Number(id));
  saveStoredStudents(updated);

  try {
    await api.delete(`/students/${id}`);
  } catch (err) {
    // Ignore offline error
  }
  return true;
};

export const getFaculty = async () => {
  try {
    const response = await api.get('/faculty');
    if (response.data && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // Fallback
  }
  return getStoredFaculty();
};

export const createFaculty = async (data) => {
  const currentFaculty = getStoredFaculty();
  const deptInfo = departmentMap[data.departmentId] || departmentMap[1];
  const newFac = {
    id: Date.now(),
    employeeId: data.employeeId || `EMP${1000 + currentFaculty.length + 1}`,
    fullName: data.fullName,
    email: data.email || `${data.fullName.toLowerCase().replace(/\s+/g, '')}@bioattend.edu`,
    phone: data.phone || "+91 98765 0000" + (currentFaculty.length + 1),
    designation: data.designation || "Assistant Professor",
    departmentId: Number(data.departmentId),
    departmentName: deptInfo.name,
    joinDate: new Date().toISOString().split('T')[0],
    assignedSubjects: [`${deptInfo.code}301 Advanced Core`]
  };

  try {
    await api.post('/faculty', data);
  } catch (err) {
    // Save in memory
  }

  const updated = [newFac, ...currentFaculty];
  saveStoredFaculty(updated);
  return newFac;
};

export const getDepartments = async () => {
  const currentStudents = getStoredStudents();
  const currentFaculty = getStoredFaculty();

  const depts = [
    { id: 1, code: "CSE", name: "Computer Science & Engineering", description: "Department of CSE - Software, AI & Systems", studentCount: 0, facultyCount: 0 },
    { id: 2, code: "ECE", name: "Electronics & Communication Eng.", description: "Department of ECE - VLSI, Embedded & Signal Processing", studentCount: 0, facultyCount: 0 },
    { id: 3, code: "ME", name: "Mechanical Engineering", description: "Department of ME - Robotics, Thermal & Manufacturing", studentCount: 0, facultyCount: 0 },
    { id: 4, code: "EEE", name: "Electrical & Electronics Eng.", description: "Department of EEE - Power Systems & Controls", studentCount: 0, facultyCount: 0 }
  ];

  return depts.map(d => ({
    ...d,
    studentCount: currentStudents.filter(s => s.departmentId === d.id).length,
    facultyCount: currentFaculty.filter(f => f.departmentId === d.id).length
  }));
};

export const getSubjects = async () => {
  try {
    const response = await api.get('/departments/subjects');
    if (response.data && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // Fallback
  }
  return [
    { id: 1, code: "CS301", name: "Data Structures & Algorithms", credits: 4, courseName: "B.Tech CSE", facultyName: "Dr. Amit Sharma" },
    { id: 2, code: "CS302", name: "Database Management Systems", credits: 4, courseName: "B.Tech CSE", facultyName: "Dr. Priya Varma" },
    { id: 3, code: "CS303", name: "Java Enterprise Programming", credits: 3, courseName: "B.Tech CSE", facultyName: "Dr. Amit Sharma" },
    { id: 4, code: "CS304", name: "Operating Systems", credits: 4, courseName: "B.Tech CSE", facultyName: "Dr. Priya Varma" },
    { id: 5, code: "EC301", name: "Digital Signal Processing", credits: 4, courseName: "B.Tech ECE", facultyName: "Prof. Rajesh Kumar" },
    { id: 6, code: "EC302", name: "Microcontrollers & Embedded Systems", credits: 3, courseName: "B.Tech ECE", facultyName: "Prof. Rajesh Kumar" },
    { id: 7, code: "ME301", name: "Thermodynamics & Heat Transfer", credits: 4, courseName: "B.Tech ME", facultyName: "Dr. Sunita Rao" },
    { id: 8, code: "EE301", name: "Control Systems & Circuit Theory", credits: 4, courseName: "B.Tech EEE", facultyName: "Prof. Vikram Reddy" }
  ];
};
