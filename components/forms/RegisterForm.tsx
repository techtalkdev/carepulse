"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"; 
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form"; 
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";
import { PatientFormValidation } from "@/lib/validation";
import { registerPatient } from "@/lib/actions/patient.actions";
  
const RegisterForm = ({ user }: { user: User }) => {

  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false); 
    // 1. Define your form.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
      resolver: zodResolver(PatientFormValidation),
      defaultValues: {
        ...PatientFormDefaultValues,
        name: "",
        email: "",
        phone: "",
      }, 
    }) 

    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
      setIsLoading(true); 

      let formData;

      if(values.identificationDocument && values.identificationDocument.length > 0){
        const blobFile = new Blob([values.identificationDocument[0]], {
          type: values.identificationDocument[0].type,
        })

        formData = new FormData(); 
        formData.append('blobFile', blobFile); 
        formData.append('fileName', values.identificationDocument[0].name)
      } 
      try {
        const patientData = {
          ...values,
          userId: user.$id,
          birthDate: new Date(values.birthDate),
          identificationDocument:formData,
        } 

        //@ts-ignore
        const patient = await registerPatient(patientData); 

        if(patient)  router.push(`patients/${user.$id}/new-appointment`);  

      } catch (error) {
        console.log(error);
        
      }
    }  

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
          <section className="space-y-4">
            <h1 className="header">Welcome👋</h1>
            <p className="text-dark-700">Let us know more about yourself.</p>
          </section>

          <section className="space-y-4">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Personal Information</h2>
            </div>
          </section>

          {/* Full Name */} 
          
          <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control} 
            name="name"
            label="Full Name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          /> 

           {/* Email & Phone Number */}  
          <div className="flex flex-col gap-6 xl:flex-row">

          <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control} 
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />  

          <CustomFormField 
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control} 
            name="phone"
            label="Phone Number"
            placeholder=""
          />  
          </div>

           {/* DATE of Birth & Gender */}   
          <div className="flex flex-col gap-6 xl:flex-row">

          <CustomFormField 
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control} 
            name="birthDate"
            label="Date of Birth"
          />  

          <CustomFormField 
            fieldType={FormFieldType.SKELETON}
            control={form.control} 
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup 
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />  
          </div>

           {/* Address & Occupation */}  

          <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control} 
            name="address"
            label="Address"
            placeholder="14 th Street, Cape town"
          /> 

          <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control} 
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />  
          </div>

           {/* Emergency Contact number & name */}  

          <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control} 
            name="emergencyContactName"
            label="Emergency contact name"
            placeholder="Guardian's Name"
          />
            <CustomFormField 
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control} 
            name="emergencyContactNumber"
            label="Emergency contact number"
            placeholder=""
          />   
          </div> 

           {/* Medical Information */}  

          <section className="space-y-4">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Medical Information</h2>
            </div>
          </section>

           {/* Primary Physician */}  
          <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.SELECT}
            control={form.control} 
            name="primaryPhysician"
            label="Primary physician"
            placeholder="Select a physician">
                {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
                  </SelectItem>
                ))}
            </CustomFormField>
          </div> 

           {/*  insurance */} 
          <div className="flex cursor-pointer items-center gap-2">
            <CustomFormField 
              fieldType={FormFieldType.INPUT}
              control={form.control} 
              name="insuranceProvider"
              label="Insurance provider"
              placeholder="ex: Naked"
            /> 

            <CustomFormField 
              fieldType={FormFieldType.INPUT}
              control={form.control} 
              name="insurancePolicyNumber"
              label="insurance policy number"
              placeholder="ex: ABC123456789"
            />  
          </div>

          {/*  allergies */} 

          <div className="flex cursor-pointer items-center gap-2">
            <CustomFormField 
              fieldType={FormFieldType.TEXTAREA}
              control={form.control} 
              name="allergies"
              label="Allergies"
              placeholder="ex: peanuts, Wheat, Milk, Corn, etc"
            /> 

            <CustomFormField 
              fieldType={FormFieldType.TEXTAREA}
              control={form.control} 
              name="currentMedication"
              label="Current medication(if any)"
              placeholder="enter your medication"
            />  
          </div>
          
          {/* Family medical history */} 

          <div className="flex cursor-pointer items-center gap-2">
            <CustomFormField 
              fieldType={FormFieldType.TEXTAREA}
              control={form.control} 
              name="familyMedicalHistory"
              label="family medical history"
              placeholder="Enter you family medical history"
            /> 

            <CustomFormField 
              fieldType={FormFieldType.TEXTAREA}
              control={form.control} 
              name="pastMedicalHistory"
              label="past medical history"
              placeholder="EX: Covid 19"
            />  
          </div>

          <section className="space-y-4">
              <div className="mb-9 space-y-1">
                <h2 className="sub-header">
                  Identification and Verification
                </h2>
              </div>
          </section>
          <CustomFormField 
            fieldType={FormFieldType.SELECT}
            control={form.control} 
            name="identificationType"
            label="Identification type"
            placeholder="Select an identification type">
              {IdentificationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </CustomFormField>

          <CustomFormField 
              fieldType={FormFieldType.INPUT}
              control={form.control} 
              name="identificationNumber"
              label="identification number"
              placeholder="ex: 123456789"
            />  

          <CustomFormField 
            fieldType={FormFieldType.SKELETON}
            control={form.control} 
            name="identificationDocument"
            label="Scanned copy of identification document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader 
                  files={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            )}
          />  
          
          <section className="space-y-4">
              <div className="mb-9 space-y-1">
                <h2 className="sub-header">
                  Consent and Privacy 
                </h2>
              </div>
          </section>

          <CustomFormField 
              fieldType={FormFieldType.CHECKBOX}
              control={form.control} 
              name="treatmentConsent"
              label="I consent to receive treatment for my health condition"
            />  

            <CustomFormField 
              fieldType={FormFieldType.CHECKBOX}
              control={form.control} 
              name="disclosureConsent"
              label="I consent to use and disclosure of my health information for treatment purposes"
            />  

            <CustomFormField 
              fieldType={FormFieldType.CHECKBOX}
              control={form.control} 
              name="privacyConsent"
              label="I acknowledge that I have reviewed and agree to the privacy policy"
            />  

          <SubmitButton isLoading={isLoading}>
            Get Started 
          </SubmitButton>
        </form>
    </Form>
  )
}

export default RegisterForm; 