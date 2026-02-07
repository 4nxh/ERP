# Functional Requirement Specification (FRS): Academics Module

## 1. Overview
The **Academics Module** is the core operational engine for students within the ERP. It is designed not just as a static display of information but as a **dynamic, state-driven system** where data from various sub-modules (Attendance, Grades, Time) influences the availability of features (Exam Forms, Submissions).

**State Principle:** The system must strictly enforce logic gates. A student cannot proceed to Step B (e.g., Printing Admit Card) unless specific criteria in Step A (e.g., Attendance > 75%) are met.

---

## 2. Functional Requirements by Sub-Module

### 2.1. Assessments & Assignments (The Task Engine)
**Objective:** Manage the lifecycle of student coursework from assignment distribution to submission and grading.

**Functional Logic:**
1.  **Status Determination:**
    *   **Active:** `CurrentDate < DueDate` AND `SubmissionStatus == null`. Action: **Enable [Submit] Button**.
    *   **Submitted:** `SubmissionStatus != null`. Action: **Show [View Submission]**, Disable [Submit].
    *   **Overdue:** `CurrentDate > DueDate` AND `SubmissionStatus == null`. Action: **Disable [Submit] Button**, Change Status Label to **"Overdue" (Red)**.
    *   **Graded:** `Marks != null`. Action: Display Score (e.g., "18/20").
2.  **Sorting Logic:**
    *   Primary Sort: `Status` (Pending > Overdue > Submitted > Graded).
    *   Secondary Sort (for Pending): `DueDate` Ascending (Earliest deadline first).
3.  **Input Constraints:**
    *   File Upload limitation: PDF/DOCX only, Max 10MB.

### 2.2. Exam Management (The Hall Ticket System)
**Objective:** Handle exam scheduling and the conditional issuance of hall tickets.

**Functional Logic:**
1.  **Hall Ticket Logic Gate (The "Attendance Lock"):**
    *   **Input:** Fetch `Overall_Attendance_Percentage` from the *Attendance Module*.
    *   **Condition:** IF `Attendance > 75%` THEN **Enable [Print Exam Form] Button** (Blue).
    *   **Else:** **Disable [Print Exam Form] Button** (Grey) AND Display Tooltip: *"Attendance (68%) is below the mandatory 75% threshold."*
2.  **Schedule Display:**
    *   Render as a card list.
    *   Format: `[DD MMM YYYY] | [HH:MM AM/PM]`
    *   Subject Line: Bold text.
    *   Location: `[Room Number], [Building Name]`.

### 2.3. Leave Application (The Workflow)
**Objective:** Digital processing of student leave requests with multi-tier approval.

**Functional Logic:**
1.  **Data Capture:**
    *   `StartDate` & `EndDate` (Date Picker).
    *   `Reason` (Dropdown: Medical, Personal, Family Event, Other).
    *   `Attachment` (Required if `Reason == Medical`).
2.  **State Machine (Workflow):**
    *   **Initial State:** `Submitted`.
    *   **Transition 1:** Faculty Action -> `Approved_By_Faculty` OR `Rejected`.
    *   **Transition 2 (If Approved By Faculty):** System auto-forwards to HOD Queue -> `Pending_HOD`.
    *   **Final State:** `Approved` (Updates Attendance Module to "Excused") OR `Rejected`.
3.  **Visual Indicators:**
    *   Pending: Yellow Badge.
    *   Approved: Green Badge.
    *   Rejected: Red Badge.

### 2.4. Academic Progress (The Analytics Engine)
**Objective:** Visualize student performance trends over time.

**Functional Logic:**
1.  **GPA Calculation:**
    *   Fetch SGPA (Semester Grade Point Average) for all completed semesters.
    *   Calculate CGPA (Cumulative Grade Point Average).
2.  **Trend Comparator:**
    *   **Formula:** `Delta = Current_Sem_SGPA - Previous_Sem_SGPA`.
    *   **Visual Logic:**
        *   IF `Delta > 0`: Rendering is **Green** (Upward Arrow). Text: *"Keep it up! +0.4 improvement."*
        *   IF `Delta < 0`: Rendering is **Red** (Downward Arrow). Text: *"Attention needed. -0.2 decline."*
        *   IF `Delta == 0`: Rendering is **Gray** (Dash).
3.  **Visualization:**
    *   Line Graph: X-Axis = Semester (Sem 1, Sem 2...), Y-Axis = GPA (0-10).

---

## 3. Data Structure Definition

Below is the JSON schema representing the `Student_Academics` object that powers the logic defined above.

```json
{
  "student_academics": {
    "student_id": "2024277634",
    "current_semester": 4,
    "overall_attendance_percent": 82.5,
    "cgpa": 8.4,
    
    "assessments": [
      {
        "id": "ASKP-001",
        "subject_code": "CS-201",
        "type": "Assignment",
        "title": "Data Structures Implementation",
        "due_date": "2026-02-15T23:59:00Z",
        "status": "PENDING",
        "submission_link": null,
        "marks_obtained": null,
        "total_marks": 20,
        "is_locked": false
      },
      {
        "id": "ASKP-002",
        "subject_code": "CS-305",
        "type": "Lab Report",
        "title": "Software Requirements Spec",
        "due_date": "2026-02-01T23:59:00Z",
        "status": "OVERDUE",
        "submission_link": null,
        "marks_obtained": null,
        "total_marks": 10,
        "is_locked": true
      }
    ],

    "exams": {
      "is_hall_ticket_eligible": true,
      "eligibility_reason": "Attendance > 75%",
      "schedule": [
        {
          "subject_code": "CS-201",
          "subject_name": "Data Structures",
          "date": "2026-03-10",
          "time": "10:00 AM",
          "venue": {
            "building": "Engineering Block A",
            "room": "304"
          }
        }
      ]
    },

    "leave_applications": [
      {
        "id": "LV-2091",
        "date_range": {
          "start": "2026-01-10",
          "end": "2026-01-12"
        },
        "reason": "Medical",
        "attachment_url": "/docs/med_cert_2091.pdf",
        "status": "APPROVED",
        "workflow_log": [
          { "stage": "Faculty", "status": "APPROVED", "timestamp": "2026-01-09T10:00:00Z" },
          { "stage": "HOD", "status": "APPROVED", "timestamp": "2026-01-09T14:30:00Z" }
        ]
      }
    ],

    "academic_history": [
      { "semester": 1, "sgpa": 7.8, "credits": 24 },
      { "semester": 2, "sgpa": 8.2, "credits": 24 },
      { "semester": 3, "sgpa": 8.5, "credits": 22 },
      { "semester": 4, "sgpa": null, "credits": 24, "status": "IN_PROGRESS" }
    ]
  }
}
```
