import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for form data
interface FormData {
  hypertension: string | null;
  diabetes:string|"No";
  cigarettes_per_day:number|0;
  sedentary_hours: number | 0;
  sleep_hours: number | 0;
  social_connectedness: number | null;
  chest_pain: string |"No";
  shortness_of_breath:string|"No";
  dizziness:string|"No";
  swelling:string|"No";
  irregular_heartbeat:string|"No";
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
  diabetes:"No",
  cigarettes_per_day:0,
  sedentary_hours: 0,
  sleep_hours: 0,
  social_connectedness:  null,
  chest_pain: "No",
  shortness_of_breath:"No",
  dizziness:"No",
  swelling:"No",
  irregular_heartbeat:"No",
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
