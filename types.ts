export interface Notice {
  id: string;
  title: string;
  description: string;
  date: Date;
  isNew: boolean;
  hasAttachment?: boolean;
}

export interface ClassSession {
  id: string;
  subject: string;
  code: string;
  time: string;
  room: string;
  professor: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  attendanceMarked: boolean;
}

export interface User {
  name: string;
  studentId: string;
  avatarUrl: string;
  program: string;
  email: string;
  department: string;
  school: string;
  planCode: string;
  academicYear: string;
  term: string;
  semester: string;
  programStatus: string;
  effectiveDate: string;
  phoneNumber: string;
}

export interface Deadline {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  urgency: 'high' | 'medium' | 'low';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}