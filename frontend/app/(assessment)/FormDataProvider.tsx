import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for form data
interface FormData {
  hypertension: string | null;
  diabetes:string|null;
  cigarettes_per_day:number|0;
  sedentary_hours: number | 0;
  sleep_hours: number | 0;
  social_connectedness: number | null;
  chest_pain: string |null;
  shortness_of_breath:string|null;
  dizziness:string|null;
  swelling:string|null;
  irregular_heartbeat:string|null;
  smoking_status:string|null;
}

// Create context with the defined type
const FormDataContext = createContext<{
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
} | undefined>(undefined);

// Define a provider component that takes `children` as a prop
export const FormDataProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>({
  hypertension: null,
  diabetes:null,
  cigarettes_per_day:0,
  sedentary_hours: 0,
  sleep_hours: 0,
  social_connectedness:  null,
  chest_pain: null,
  shortness_of_breath:null,
  dizziness:null,
  swelling:null,
  irregular_heartbeat:null,
  smoking_status:null,
  });

  // Function to update form data
  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

// Custom hook to access form data and update it
export const useFormData = (): {
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
} => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
};
