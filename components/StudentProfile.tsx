import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Save,
    Upload,
    User,
    Calendar,
    MapPin,
    CreditCard,
    FileText,
    Image as ImageIcon,
    Phone,
    Mail,
    Users,
    Check
} from 'lucide-react';

interface UserProfile {
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
    studentPhoto: string | null;
    fatherPhoto: string | null;
    motherPhoto: string | null;
}

interface StudentProfileProps {
    userProfile: UserProfile;
    onProfileUpdate: (updates: Partial<UserProfile>) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ userProfile, onProfileUpdate }) => {
    const [activeTab, setActiveTab] = useState<'personal' | 'educational'>('personal');
    const [openSection, setOpenSection] = useState<string>('basic');
    const [sameAsPermanent, setSameAsPermanent] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [changedFields, setChangedFields] = useState<string[]>([]);

    // --- State Management ---
    const [formData, setFormData] = useState({
        // Basic Info - synced from userProfile
        studentName: userProfile.name,
        hindiName: 'एलेक्स जॉनसन',
        adhaarName: userProfile.name,
        enrollmentNo: userProfile.studentId,
        abcId: 'ABC123456',
        scholarNo: 'SCH-2024-001',
        rollNo: '24CSE001',
        class: userProfile.program,
        section: 'A',
        bloodGroup: 'O+',
        gender: 'Male',
        religion: 'Christian',
        dob: '2004-05-15',

        // Contact & Demographics - synced from userProfile
        mobile: userProfile.phoneNumber,
        email: userProfile.email,
        adhaarNo: '1234-5678-9012',
        maritalStatus: 'Unmarried',
        category: 'GEN',
        domicile: 'Delhi',

        // Parent Information
        fatherName: 'Robert Johnson',
        fatherOccupation: 'Engineer',
        fatherMobile: '9876543211',
        fatherOffice: '123 Tech Park, Sector 62, Noida',

        motherName: 'Sarah Johnson',
        motherOccupation: 'Teacher',
        motherIncome: '800000',

        // Address Details
        pAddressLine1: '45/2, Civil Lines',
        pCity: 'New Delhi',
        pPinCode: '110054',
        pState: 'Delhi',

        cAddressLine1: '45/2, Civil Lines',
        cCity: 'New Delhi',
        cPinCode: '110054',
        cState: 'Delhi',

        // Banking & KYC
        bankName: 'HDFC Bank',
        accountNo: '501002345678',
        ifsc: 'HDFC0001234',
        passportNo: 'Z1234567',
        visaNo: '',

        // Images - synced from userProfile
        studentPhoto: userProfile.studentPhoto,
        fatherPhoto: userProfile.fatherPhoto,
        motherPhoto: userProfile.motherPhoto,
    });

    // Store original data to track changes
    const [originalData] = useState({ ...formData });

    const [documents, setDocuments] = useState([
        { id: 1, name: '10th Marksheet', submittedDate: '2024-08-01', fileName: '10th_marks.pdf' },
        { id: 2, name: '12th Marksheet', submittedDate: '2024-08-01', fileName: '12th_marks.pdf' },
        { id: 3, name: 'Transfer Certificate', submittedDate: '2024-08-05', fileName: 'tc.pdf' },
    ]);

    // --- Handlers ---

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? '' : section);
    };

    // Field name mappings for user-friendly display
    const fieldLabels: { [key: string]: string } = {
        studentName: 'Student Name',
        mobile: 'Mobile Number',
        email: 'Email Address',
        studentPhoto: 'Student Photo',
        fatherPhoto: 'Father Photo',
        motherPhoto: 'Mother Photo',
        adhaarNo: 'Aadhaar Number',
        bankName: 'Bank Name',
        accountNo: 'Account Number',
        ifsc: 'IFSC Code',
        pAddressLine1: 'Permanent Address',
        pCity: 'Permanent City',
        pPinCode: 'Permanent PIN Code',
        pState: 'Permanent State',
        cAddressLine1: 'Correspondence Address',
        cCity: 'Correspondence City',
        fatherName: 'Father Name',
        fatherMobile: 'Father Mobile',
        motherName: 'Mother Name',
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Track changed fields
        if (value !== originalData[name as keyof typeof originalData]) {
            if (!changedFields.includes(name)) {
                setChangedFields(prev => [...prev, name]);
            }
        } else {
            setChangedFields(prev => prev.filter(f => f !== name));
        }
    };

    const handleAddressCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setSameAsPermanent(checked);
        if (checked) {
            setFormData(prev => ({
                ...prev,
                cAddressLine1: prev.pAddressLine1,
                cCity: prev.pCity,
                cPinCode: prev.pPinCode,
                cState: prev.pState
            }));
            // Mark address fields as changed
            setChangedFields(prev => [...new Set([...prev, 'cAddressLine1', 'cCity', 'cPinCode', 'cState'])]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setFormData(prev => ({
                    ...prev,
                    [fieldName]: result
                }));
                // Track photo changes
                if (!changedFields.includes(fieldName)) {
                    setChangedFields(prev => [...prev, fieldName]);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (changedFields.length === 0) {
            alert('No changes detected.');
            return;
        }

        // Build update object for global state
        const updates: Partial<UserProfile> = {};

        // Map form fields to userProfile fields
        if (changedFields.includes('studentName')) updates.name = formData.studentName;
        if (changedFields.includes('mobile')) updates.phoneNumber = formData.mobile;
        if (changedFields.includes('email')) updates.email = formData.email;
        if (changedFields.includes('studentPhoto')) updates.studentPhoto = formData.studentPhoto;
        if (changedFields.includes('fatherPhoto')) updates.fatherPhoto = formData.fatherPhoto;
        if (changedFields.includes('motherPhoto')) updates.motherPhoto = formData.motherPhoto;

        // If name changed, also update avatar URL (in a real app, this would be a different flow)
        if (updates.name) {
            updates.avatarUrl = formData.studentPhoto || userProfile.avatarUrl;
        }

        // Update global state
        onProfileUpdate(updates);

        // Show success message with changed fields
        const changedFieldLabels = changedFields.map(f => fieldLabels[f] || f).join(', ');
        setUpdateSuccess(true);

        // Reset changed fields tracking
        setChangedFields([]);

        // Hide success message after 3 seconds
        setTimeout(() => setUpdateSuccess(false), 3000);
    };

    // --- Render Helpers ---

    const SectionHeader = ({ id, title, icon: Icon }: { id: string, title: string, icon: any }) => (
        <button
            type="button"
            onClick={() => toggleSection(id)}
            className={`w-full flex items-center justify-between p-4 px-6 text-left transition-colors ${openSection === id
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-neutral-900 text-gray-800 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800'
                }`}
        >
            <div className="flex items-center gap-3">
                <Icon size={20} />
                <span className="font-semibold text-lg">{title}</span>
            </div>
            {openSection === id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
    );

    return (
        <div className="max-w-5xl mx-auto pb-24">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Profile</h1>
                    <p className="text-gray-500 dark:text-neutral-400">Manage your personal and academic information</p>
                </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex justify-center mb-2">
                <div className="flex w-full md:w-auto rounded-lg overflow-hidden border border-gray-300 dark:border-neutral-700">
                    <button
                        type="button"
                        onClick={() => { setActiveTab('personal'); setOpenSection('basic'); }}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'personal'
                            ? 'bg-[#2d3748] text-white'
                            : 'bg-white dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-700'
                            }`}
                    >
                        Personal Details
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('educational'); setOpenSection(''); }}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 text-sm font-semibold transition-colors border-l border-gray-300 dark:border-neutral-700 ${activeTab === 'educational'
                            ? 'bg-[#2d3748] text-white'
                            : 'bg-white dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-700'
                            }`}
                    >
                        Educational Details
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                {activeTab === 'personal' && (
                    <>

                        {/* 1. Basic Information */}
                        <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-neutral-900">
                            <SectionHeader id="basic" title="Basic Information" icon={User} />

                            {openSection === 'basic' && (
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Student Name</label>
                                        <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Hindi Name</label>
                                        <input type="text" name="hindiName" value={formData.hindiName} onChange={handleInputChange} placeholder="Use Google Input Tools" className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Adhaar Name</label>
                                        <input type="text" name="adhaarName" value={formData.adhaarName} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>

                                    {/* Read Only Fields */}
                                    <div className="space-y-1 opacity-75">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Enrollment No (Read-only)</label>
                                        <input type="text" value={formData.enrollmentNo} readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-1 opacity-75">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">ABC ID (Read-only)</label>
                                        <input type="text" value={formData.abcId} readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-1 opacity-75">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Scholar No (Read-only)</label>
                                        <input type="text" value={formData.scholarNo} readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                    </div>

                                    {/* Selects */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Class</label>
                                        <select name="class" value={formData.class} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option>B.Tech CS</option>
                                            <option>B.Tech IT</option>
                                            <option>BCA</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Section</label>
                                        <select name="section" value={formData.section} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option>A</option>
                                            <option>B</option>
                                            <option>C</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Date of Birth</label>
                                        <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Contact & Demographics */}
                        <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-neutral-900">
                            <SectionHeader id="contact" title="Contact & Demographics" icon={Phone} />

                            {openSection === 'contact' && (
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Mobile No</label>
                                        <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Email ID</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Adhaar No</label>
                                        <input type="text" name="adhaarNo" value={formData.adhaarNo} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Marital Status</label>
                                        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option>Unmarried</option>
                                            <option>Married</option>
                                            <option>Divorced</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Category</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option>GEN</option>
                                            <option>OBC</option>
                                            <option>SC</option>
                                            <option>ST</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Domicile State</label>
                                        <input type="text" name="domicile" value={formData.domicile} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. Parent Information */}
                        <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-neutral-900">
                            <SectionHeader id="parents" title="Parent Information" icon={Users} />

                            {openSection === 'parents' && (
                                <div className="p-6 animate-fade-in space-y-8">
                                    {/* Father */}
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-600 mb-4 uppercase tracking-wide">Father's Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Name</label>
                                                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Occupation</label>
                                                <input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Mobile</label>
                                                <input type="tel" name="fatherMobile" value={formData.fatherMobile} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Office Address</label>
                                                <input type="text" name="fatherOffice" value={formData.fatherOffice} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mother */}
                                    <div>
                                        <h4 className="text-sm font-bold text-pink-600 mb-4 uppercase tracking-wide">Mother's Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Name</label>
                                                <input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Occupation</label>
                                                <input type="text" name="motherOccupation" value={formData.motherOccupation} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Annual Income</label>
                                                <input type="number" name="motherIncome" value={formData.motherIncome} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 4. Address Details */}
                        <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-neutral-900">
                            <SectionHeader id="address" title="Address Details" icon={MapPin} />

                            {openSection === 'address' && (
                                <div className="p-6 animate-fade-in space-y-8">
                                    {/* Permanent */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 uppercase tracking-wide">Permanent Address</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Address Line 1</label>
                                                <input type="text" name="pAddressLine1" value={formData.pAddressLine1} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">City</label>
                                                <input type="text" name="pCity" value={formData.pCity} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">State</label>
                                                <select name="pState" value={formData.pState} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                                                    <option>Delhi</option>
                                                    <option>Haryana</option>
                                                    <option>Uttar Pradesh</option>
                                                    <option>Punjab</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Pin Code</label>
                                                <input type="text" name="pPinCode" value={formData.pPinCode} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Correspondence */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">Correspondence Address</h4>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={sameAsPermanent} onChange={handleAddressCheckbox} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                                                <span className="text-sm text-gray-600 dark:text-neutral-400">Same as Permanent</span>
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Address Line 1</label>
                                                <input type="text" name="cAddressLine1" value={formData.cAddressLine1} onChange={handleInputChange} disabled={sameAsPermanent} className={`w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none ${sameAsPermanent ? 'opacity-50 cursor-not-allowed' : ''}`} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">City</label>
                                                <input type="text" name="cCity" value={formData.cCity} onChange={handleInputChange} disabled={sameAsPermanent} className={`w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none ${sameAsPermanent ? 'opacity-50 cursor-not-allowed' : ''}`} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">State</label>
                                                <select name="cState" value={formData.cState} onChange={handleInputChange} disabled={sameAsPermanent} className={`w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none ${sameAsPermanent ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                    <option>Delhi</option>
                                                    <option>Haryana</option>
                                                    <option>Uttar Pradesh</option>
                                                    <option>Punjab</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Pin Code</label>
                                                <input type="text" name="cPinCode" value={formData.cPinCode} onChange={handleInputChange} disabled={sameAsPermanent} className={`w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none ${sameAsPermanent ? 'opacity-50 cursor-not-allowed' : ''}`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 5. Banking & KYC */}
                        <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-neutral-900">
                            <SectionHeader id="banking" title="Banking & KYC" icon={CreditCard} />

                            {openSection === 'banking' && (
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Bank Name</label>
                                        <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Account No</label>
                                        <input type="text" name="accountNo" value={formData.accountNo} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">IFSC Code</label>
                                        <input type="text" name="ifsc" value={formData.ifsc} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Passport No</label>
                                        <input type="text" name="passportNo" value={formData.passportNo} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Visa No</label>
                                        <input type="text" name="visaNo" value={formData.visaNo} onChange={handleInputChange} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 6. Document Uploads */}
                        <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-neutral-900">
                            <SectionHeader id="documents" title="Document Uploads" icon={FileText} />

                            {openSection === 'documents' && (
                                <div className="p-6 animate-fade-in">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase">Uploaded Documents</h4>
                                        <div className="flex gap-2">
                                            <select className="p-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-sm text-gray-900 dark:text-white outline-none">
                                                <option>Select Document Type</option>
                                                <option>Mark Sheet</option>
                                                <option>Certificate</option>
                                                <option>ID Proof</option>
                                            </select>
                                            <button type="button" className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                                                <Upload size={16} /> Upload New
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-700 dark:text-neutral-300">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-neutral-800/50 dark:text-neutral-300">
                                                <tr>
                                                    <th className="px-6 py-3">Sr. No</th>
                                                    <th className="px-6 py-3">Document Name</th>
                                                    <th className="px-6 py-3">Submitted Date</th>
                                                    <th className="px-6 py-3">File Name</th>
                                                    <th className="px-6 py-3">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {documents.map((doc, index) => (
                                                    <tr key={doc.id} className="bg-white border-b dark:bg-neutral-900 dark:border-neutral-800">
                                                        <td className="px-6 py-4">{index + 1}</td>
                                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{doc.name}</td>
                                                        <td className="px-6 py-4">{doc.submittedDate}</td>
                                                        <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">{doc.fileName}</td>
                                                        <td className="px-6 py-4">
                                                            <button type="button" className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 7. Images */}
                        <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-neutral-900">
                            <SectionHeader id="images" title="Profile Images" icon={ImageIcon} />

                            {openSection === 'images' && (
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                                    {['studentPhoto', 'fatherPhoto', 'motherPhoto'].map((photoField) => {
                                        const photoValue = formData[photoField as keyof typeof formData] as string | null;
                                        const photoLabels: { [key: string]: string } = {
                                            studentPhoto: 'Student Photo',
                                            fatherPhoto: 'Father Photo',
                                            motherPhoto: 'Mother Photo'
                                        };
                                        return (
                                            <div key={photoField} className="flex flex-col items-center gap-4">
                                                <h4 className="font-semibold text-gray-700 dark:text-neutral-300">
                                                    {photoLabels[photoField]}
                                                </h4>
                                                <div className="relative">
                                                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 dark:border-neutral-700 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-neutral-800 relative group cursor-pointer">
                                                        {photoValue ? (
                                                            <img src={photoValue} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-1 text-gray-400">
                                                                <Upload size={24} />
                                                                <span className="text-xs">Upload</span>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                            <span className="text-white text-xs font-bold">{photoValue ? 'Change' : 'Upload'}</span>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(e, photoField)}
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                    {photoValue && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, [photoField]: null }))}
                                                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors"
                                                            title="Remove photo"
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-neutral-500 text-center">
                                                    {photoValue ? 'Click to change' : 'Click to upload'}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'educational' && (
                    <>
                        {/* Current Enrollment */}
                        <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-neutral-900">
                            <SectionHeader id="enrollment" title="Current Enrollment" icon={Calendar} />
                            {openSection === 'enrollment' && (
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                                    <div className="space-y-1 opacity-75">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Course</label>
                                        <input type="text" value="B.Tech Computer Science" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-1 opacity-75">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Batch</label>
                                        <input type="text" value="2024-2028" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-1 opacity-75">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Current Semester</label>
                                        <input type="text" value="2nd Semester" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-1 opacity-75">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Admission Date</label>
                                        <input type="text" value="01 Aug 2024" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-1 opacity-75">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Admission Type</label>
                                        <input type="text" value="Regular" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-1 opacity-75">
                                        <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">CGPA</label>
                                        <input type="text" value="8.5" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Previous Education */}
                        <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-neutral-900">
                            <SectionHeader id="prevEducation" title="Previous Education" icon={FileText} />
                            {openSection === 'prevEducation' && (
                                <div className="p-6 animate-fade-in space-y-6">
                                    {/* 12th Standard */}
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-600 mb-4 uppercase tracking-wide">12th Standard / Higher Secondary</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Board</label>
                                                <input type="text" value="CBSE" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">School Name</label>
                                                <input type="text" value="Delhi Public School" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Year of Passing</label>
                                                <input type="text" value="2024" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Percentage / CGPA</label>
                                                <input type="text" value="92.4%" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* 10th Standard */}
                                    <div>
                                        <h4 className="text-sm font-bold text-green-600 mb-4 uppercase tracking-wide">10th Standard / Secondary</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Board</label>
                                                <input type="text" value="CBSE" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">School Name</label>
                                                <input type="text" value="Delhi Public School" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Year of Passing</label>
                                                <input type="text" value="2022" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase">Percentage / CGPA</label>
                                                <input type="text" value="95.2%" readOnly className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 cursor-not-allowed" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Semester Results */}
                        <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-neutral-900">
                            <SectionHeader id="results" title="Semester Results" icon={CreditCard} />
                            {openSection === 'results' && (
                                <div className="p-6 animate-fade-in">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-700 dark:text-neutral-300">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-neutral-800/50 dark:text-neutral-300">
                                                <tr>
                                                    <th className="px-6 py-3">Semester</th>
                                                    <th className="px-6 py-3">SGPA</th>
                                                    <th className="px-6 py-3">CGPA</th>
                                                    <th className="px-6 py-3">Credits Earned</th>
                                                    <th className="px-6 py-3">Result</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="bg-white border-b dark:bg-neutral-900 dark:border-neutral-800">
                                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Semester 1</td>
                                                    <td className="px-6 py-4">8.5</td>
                                                    <td className="px-6 py-4">8.5</td>
                                                    <td className="px-6 py-4">22</td>
                                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">Pass</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Sticky Update Button */}
                <div className="sticky bottom-4 z-10 flex justify-end gap-4 items-center">
                    {/* Success Message */}
                    {updateSuccess && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold animate-fade-in">
                            <Check size={18} /> Profile updated successfully!
                        </div>
                    )}

                    {/* Change Count Badge */}
                    {changedFields.length > 0 && !updateSuccess && (
                        <div className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-semibold">
                            {changedFields.length} unsaved change{changedFields.length > 1 ? 's' : ''}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold shadow-lg transform transition-all hover:scale-105 active:scale-95 ${changedFields.length > 0
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
                                : 'bg-gray-300 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400 cursor-not-allowed shadow-none'
                            }`}
                        disabled={changedFields.length === 0}
                    >
                        <Save size={20} /> Update Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentProfile;
