# Functional Specification: Syllabus Section

## 1. Overview
The **Syllabus Section** is a central hub within the Student ERP dashboard designed to help students track their academic progress module-by-module. This feature addresses the common problem of students being unsure about "what comes next" or "how much is left" in a semester.

**Target Audience:** Undergraduate and Graduate students tracking their academic progress.

---

## 2. User Flow

1. **Navigation:** The user clicks on the "Academics" tab in the main navigation or a "View Syllabus" Quick Action.
2. **Default State:** Upon loading, the system automatically selects the first subject from the enrolled list (e.g., "Data Structures").
3. **Subject Selection:** 
   - The user clicks the **Subject Selector** dropdown at the top left.
   - The user selects a different subject (e.g., "Linear Algebra").
   - The page content refreshes to display the syllabus for the newly selected subject.
4. **Download Syllabus:** 
   - The user clicks the **Download PDF** button/icon next to the selector.
   - The browser initiates a download of the official syllabus document.
5. **View Progress:** 
   - The user scrolls through the list of modules/chapters.
   - Each module displays its name and completion percentage.
   - A visual progress bar with a unique "Book Icon" anchor clearly indicates progress.

---

## 3. UI Layout & Wireframe

```text
+-------------------------------------------------------+
|  [ HEADER AREA ]                                      |
|                                                       |
|  [ Subject Dropdown (v) ]      [ (Icon) Download PDF ]|
|  | Data Structures      |                             |
|  +----------------------+                             |
|                                                       |
+-------------------------------------------------------+
|  [ MODULE LIST AREA ]                                 |
|                                                       |
|   1. Introduction to Algorithms           80%         |
|   [============================(Book)>      ]         |
|                                                       |
|   2. Arrays & Linked Lists                45%         |
|   [===============(Book)>                   ]         |
|                                                       |
|   3. Stacks & Queues                      10%         |
|   [===(Book)>                               ]         |
|                                                       |
|   4. Trees & Graphs                       0%          |
|   [(Book)>                                  ]         |
|                                                       |
+-------------------------------------------------------+
```

---

## 4. Component Breakdown & Specifications

### 4.1. Header Component
- **Container:** Flex container with `justify-between`.
- **Subject Selector:**
  - **Type:** Dropdown / Select Input.
  - **Behavior:** `onChange` updates the local state `selectedSubject`.
  - **Data Source:** List of enrolled subjects from `user.subjects`.
- **Download Action:**
  - **Type:** Button or Icon Link.
  - **Icon:** `Download` or `FileText` from Lucide.
  - **Label:** "Syllabus PDF" (optional on mobile, required on desktop).

### 4.2. Module List Component
- **Container:** Vertically stacked list container.
- **Data Source:** Array of modules for the selected subject.
  - Structure: `{ id, title, completedPercentage }`.

### 4.3. Progress Bar Component ("The Book Tracker")
- **Container:** Relative positioning context taking up full width.
- **Track:** Gray background (`bg-gray-100` / `dark:bg-neutral-800`), rounded corners, fixed height (e.g., `h-2` or `h-3`).
- **Fill:** Colored bar (`bg-blue-500` or subject-specific color), absolute position, width based on `percentage`.
- **Anchor Icon (The Styling Hook):**
  - **Icon:** A small book icon (`Book` or `BookOpen` from Lucide).
  - **Positioning:** Absolute. `left` property set dynamically to `percentage`.
  - **Transform:** `translateX(-50%)` to center the book on the tip, or `translateX(-100%)` to have it sit *at* the tip.
  - **Styling:** Small size (e.g., `w-4 h-4`), possibly with a subtle shadow or glow to make it pop.

---

## 5. Technical Implementation Details
- **State Management:**
  - `selectedSubjectId`: ID of the currently viewed subject.
  - `syllabusData`: Object mapping subject IDs to their module lists.
- **Mock Data Requirement:** Need robust mock data for at least 3 subjects to demonstrate the switching capability.
- **Responsiveness:**
  - On mobile, the subject selector should be full width.
  - The download button can reduce to just an icon to save space.
