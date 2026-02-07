import { ClassSession, Deadline, User } from './types';

export const CURRENT_USER: User = {
  name: "Alex",
  studentId: "2024277634",
  avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  program: "B.Tech (CSE) with Specialization in Artificial Intelligence & Machine Learning",
  email: "xyz.alex@niu.edu.in",
  department: "Computer Science and Engineering",
  school: "SET",
  planCode: "0000100026",
  academicYear: "2025-26-Sem II",
  term: "2502",
  semester: "S4",
  programStatus: "MATR",
  effectiveDate: "09-AUG-24",
  phoneNumber: "9898292921"
};

export const TODAY_CLASSES: ClassSession[] = [
  {
    id: '1',
    subject: 'Data Structures',
    code: 'CS-201',
    time: '09:00 AM - 10:30 AM',
    room: 'Lab 304',
    professor: 'Dr. Smith',
    status: 'completed',
    attendanceMarked: true
  },
  {
    id: '2',
    subject: 'Linear Algebra',
    code: 'MATH-102',
    time: '11:00 AM - 12:30 PM',
    room: 'Hall B',
    professor: 'Prof. Johnson',
    status: 'ongoing',
    attendanceMarked: false
  },
  {
    id: '3',
    subject: 'Software Eng.',
    code: 'CS-305',
    time: '02:00 PM - 03:30 PM',
    room: 'Room 101',
    professor: 'Dr. Lee',
    status: 'upcoming',
    attendanceMarked: false
  }
];

export const UPCOMING_DEADLINES: Deadline[] = [
  {
    id: 'd1',
    title: 'Data Structures Assignment',
    subject: 'CS-201',
    dueDate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    urgency: 'high'
  },
  {
    id: 'd2',
    title: 'Project Proposal',
    subject: 'CS-305',
    dueDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24 hours
    urgency: 'medium'
  }
];

export const SYSTEM_PROMPT = `You are an AI Academic Co-Pilot for a university student named Alex. 
Your goal is to help them manage their schedule, study efficiently, and reduce stress. 
Keep your responses concise, encouraging, and helpful. 
You have access to their schedule: Data Structures (Done), Linear Algebra (Now), Software Eng (Later).`;