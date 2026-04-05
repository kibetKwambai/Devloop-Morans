
import React, { useState } from 'react';
import { JobSeekerProfile, WorkExperience, Education } from '../types';
import { Icon } from './Icon';

interface ProfileFormProps {
  profile: JobSeekerProfile;
  onSave: (updatedProfile: JobSeekerProfile) => void;
  onCancel: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState<JobSeekerProfile>(profile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section?: keyof JobSeekerProfile, index?: number, field?: string) => {
    const { name, value } = e.target;
    
    if (section && typeof index === 'number' && field) {
      const sectionData = [...(formData[section] as any[])];
      sectionData[index] = { ...sectionData[index], [field]: value };
      setFormData({ ...formData, [section]: sectionData });
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof JobSeekerProfile] as any),
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof JobSeekerProfile] as any),
          [child]: checked
        }
      });
    } else {
      setFormData({ ...formData, [name]: checked });
    }
  };

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: `new_exp_${Date.now()}`,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      responsibilities: []
    };
    setFormData({ ...formData, workExperience: [...formData.workExperience, newExp] });
  };
  
  const removeWorkExperience = (index: number) => {
      const updatedExperience = formData.workExperience.filter((_, i) => i !== index);
      setFormData({...formData, workExperience: updatedExperience});
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: `new_edu_${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: ''
    };
    setFormData({ ...formData, education: [...formData.education, newEdu] });
  };
  
  const removeEducation = (index: number) => {
      const updatedEducation = formData.education.filter((_, i) => i !== index);
      setFormData({...formData, education: updatedEducation});
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const inputBaseClasses = "mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-indigo-800 text-slate-900 dark:text-white sm:text-sm";

  const renderInputField = (label: string, name: string, value: string | number, section?: keyof JobSeekerProfile, index?: number, type: string = "text") => (
    <div>
      <label htmlFor={`${name}-${index}`} className="block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
      <input
        type={type}
        id={`${name}-${index}`}
        name={name}
        value={value}
        onChange={(e) => handleInputChange(e, section, index, name)}
        className={inputBaseClasses}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Your Profile</h2>
        <div className="flex space-x-3">
            <button type="button" onClick={onCancel} className="bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600 py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50">
                Cancel
            </button>
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Save Changes
            </button>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white dark:bg-indigo-900 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInputField('Full Name', 'name', formData.name)}
          {renderInputField('Headline', 'headline', formData.headline)}
          {renderInputField('Email', 'email', formData.email)}
          {renderInputField('Phone', 'phone', formData.phone)}
          {renderInputField('Location', 'location', formData.location)}
          {renderInputField('Photo URL', 'photoUrl', formData.photoUrl)}
          {renderInputField('LinkedIn URL', 'linkedinUrl', formData.linkedinUrl || '')}
          {renderInputField('Portfolio URL', 'portfolioUrl', formData.portfolioUrl || '')}
        </div>
      </div>

      {/* Detailed Personal Info */}
      <div className="bg-white dark:bg-indigo-900 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Detailed Personal Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderInputField('Blood Group', 'personalInfo.bloodGroup', formData.personalInfo?.bloodGroup || '')}
          {renderInputField('Tribe', 'personalInfo.tribe', formData.personalInfo?.tribe || '')}
          {renderInputField('Height', 'personalInfo.height', formData.personalInfo?.height || '')}
          {renderInputField('Weight', 'personalInfo.weight', formData.personalInfo?.weight || '')}
          {renderInputField('BMI', 'personalInfo.bmi', formData.personalInfo?.bmi || '', undefined, undefined, 'number')}
        </div>
      </div>

      {/* Health & Legal */}
      <div className="bg-white dark:bg-indigo-900 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Health & Legal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Health Condition</label>
            <textarea
              name="healthInfo.condition"
              value={formData.healthInfo?.condition || ''}
              onChange={handleInputChange}
              rows={2}
              className={inputBaseClasses}
              placeholder="List any health conditions or 'None'"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Security Clearance Level</label>
            <input
              type="text"
              name="legalInfo.securityClearanceLevel"
              value={formData.legalInfo?.securityClearanceLevel || ''}
              onChange={handleInputChange}
              className={inputBaseClasses}
              placeholder="e.g. Level 1, Top Secret, None"
            />
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="hasCriminalRecord"
              name="legalInfo.hasCriminalRecord"
              checked={formData.legalInfo?.hasCriminalRecord || false}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
            />
            <label htmlFor="hasCriminalRecord" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              I have a criminal record
            </label>
          </div>
          {renderInputField('Police Clearance URL', 'legalInfo.policeClearanceUrl', formData.legalInfo?.policeClearanceUrl || '')}
        </div>
      </div>

      {/* Work Experience */}
      <div className="bg-white dark:bg-indigo-900 p-6 rounded-lg shadow-md space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Work Experience</h3>
            <button type="button" onClick={addWorkExperience} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                + Add Experience
            </button>
        </div>
        {formData.workExperience.map((exp, index) => (
          <div key={exp.id} className="border border-slate-200 dark:border-slate-700 p-4 rounded-md space-y-4 relative">
            <button type="button" onClick={() => removeWorkExperience(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                <Icon name="xMark" className="h-5 w-5"/>
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInputField('Job Title', 'title', exp.title, 'workExperience', index)}
              {renderInputField('Company', 'company', exp.company, 'workExperience', index)}
              {renderInputField('Location', 'location', exp.location, 'workExperience', index)}
              <div className="grid grid-cols-2 gap-2">
                {renderInputField('Start Date', 'startDate', exp.startDate, 'workExperience', index)}
                {renderInputField('End Date', 'endDate', exp.endDate, 'workExperience', index)}
              </div>
            </div>
             <div>
                <label htmlFor={`description-${index}`} className="block text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
                <textarea
                    id={`description-${index}`}
                    name="description"
                    rows={3}
                    value={exp.description}
                    onChange={(e) => handleInputChange(e, 'workExperience', index, 'description')}
                    className={inputBaseClasses}
                />
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="bg-white dark:bg-indigo-900 p-6 rounded-lg shadow-md space-y-4">
         <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Education</h3>
            <button type="button" onClick={addEducation} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                + Add Education
            </button>
        </div>
        {formData.education.map((edu, index) => (
          <div key={edu.id} className="border border-slate-200 dark:border-slate-700 p-4 rounded-md space-y-4 relative">
            <button type="button" onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                 <Icon name="xMark" className="h-5 w-5"/>
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInputField('Institution', 'institution', edu.institution, 'education', index)}
              {renderInputField('Degree', 'degree', edu.degree, 'education', index)}
              {renderInputField('Field of Study', 'fieldOfStudy', edu.fieldOfStudy, 'education', index)}
              <div className="grid grid-cols-2 gap-2">
                {renderInputField('Start Date', 'startDate', edu.startDate, 'education', index)}
                {renderInputField('End Date', 'endDate', edu.endDate, 'education', index)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};