import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useProfile } from '../contexts/ProfileContext'
import { toast } from 'react-hot-toast'
import {
  GraduationCap,
  Target,
  IndianRupee,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

const onboardingSchema = z.object({
  educationLevel: z.string().min(1, 'Please select your education level'),
  degree: z.string().min(2, 'Please enter your degree'),
  major: z.string().min(2, 'Please enter your major'),
  graduationYear: z.number().min(2000, 'Please enter a valid graduation year').max(2035, 'Please enter a valid graduation year'),
  gpa: z.preprocess((val) => val === "" ? undefined : Number(val), z.number().min(0).max(4.0).optional()),
  intendedDegree: z.string().min(1, 'Please select your intended degree'),
  fieldOfStudy: z.string().min(2, 'Please enter your field of study'),
  targetIntake: z.string().min(1, 'Please select your target intake'),
  preferredCountries: z.array(z.string()).min(1, 'Please select at least one preferred country'),
  budget: z.number().min(0, 'Budget must be at least 0'),
  fundingPlan: z.string().min(1, 'Please select your funding plan'),
  ielts: z.number().min(0, 'IELTS score must be at least 0').max(9.0, 'IELTS score cannot exceed 9.0').optional(),
  toefl: z.number().min(0, 'TOEFL score must be at least 0').max(120, 'TOEFL score cannot exceed 120').optional(),
  gre: z.number().min(260, 'GRE score must be at least 260').max(340, 'GRE score cannot exceed 340').optional(),
  gmat: z.number().min(200, 'GMAT score must be at least 200').max(800, 'GMAT score cannot exceed 800').optional(),
  sopStatus: z.string().min(1, 'Please select your SOP status')
})

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Singapore',
  'New Zealand', 'Ireland', 'Japan', 'South Korea'
]

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { createProfile } = useProfile()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange'
  })


  const watchedValues = watch()

  const steps = [
    { id: 1, title: 'Academic Background', icon: GraduationCap },
    { id: 2, title: 'Study Goals', icon: Target },
    { id: 3, title: 'Budget & Exams', icon: IndianRupee },
    { id: 4, title: 'Review & Complete', icon: CheckCircle }
  ]

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const profileData = {
        ...data,
        stage: 'Discovering Universities',
        isCompleted: true
      }

      const result = await createProfile(profileData)
      
      if (result.success) {
        toast.success('Profile created successfully!')
        navigate('/dashboard')
      } else {
        toast.error(result.error || 'Failed to create profile')
      }
    } catch (error) {
      toast.error('An error occurred while creating your profile')
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = async () => {
    let fieldsToValidate = []
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['educationLevel', 'degree', 'major', 'graduationYear']
        break
      case 2:
        fieldsToValidate = ['intendedDegree', 'fieldOfStudy', 'targetIntake', 'preferredCountries']
        break
      case 3:
        fieldsToValidate = ['budget', 'fundingPlan', 'sopStatus']
        break
      default:
        break
    }

    const isStepValid = await trigger(fieldsToValidate)
    if (isStepValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }


  const handleCountryToggle = (country) => {
    const currentCountries = watchedValues.preferredCountries || []
    if (currentCountries.includes(country)) {
      setValue('preferredCountries', currentCountries.filter(c => c !== country))
    } else {
      setValue('preferredCountries', [...currentCountries, country])
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Education Level
              </label>
              <select
                {...register('educationLevel')}
                className="input-field"
              >
                <option value="">Select your education level</option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
              {errors.educationLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.educationLevel.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Degree
                </label>
                <input
                  {...register('degree')}
                  type="text"
                  className="input-field"
                  placeholder="e.g., B.Tech, B.Sc, High School Diploma"
                />
                {errors.degree && (
                  <p className="mt-1 text-sm text-red-600">{errors.degree.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Major/Stream
                </label>
                <input
                  {...register('major')}
                  type="text"
                  className="input-field"
                  placeholder="e.g., Computer Science, Business, Arts"
                />
                {errors.major && (
                  <p className="mt-1 text-sm text-red-600">{errors.major.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Graduation Year
                </label>
                <input
                  {...register('graduationYear', { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="e.g., 2024"
                />
                {errors.graduationYear && (
                  <p className="mt-1 text-sm text-red-600">{errors.graduationYear.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GPA (Optional)
                </label>
                <input
                  {...register('gpa', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="e.g., 3.5"
                />
                {errors.gpa && (
                  <p className="mt-1 text-sm text-red-600">{errors.gpa.message}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Intended Degree
              </label>
              <select
                {...register('intendedDegree')}
                className="input-field"
              >
                <option value="">Select your intended degree</option>
                <option value="Bachelor">Bachelor's</option>
                <option value="Master">Master's</option>
                <option value="MBA">MBA</option>
                <option value="PhD">PhD</option>
              </select>
              {errors.intendedDegree && (
                <p className="mt-1 text-sm text-red-600">{errors.intendedDegree.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Field of Study
              </label>
              <input
                {...register('fieldOfStudy')}
                type="text"
                className="input-field"
                placeholder="e.g., Computer Science, Business Administration, Engineering"
              />
              {errors.fieldOfStudy && (
                <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Intake
              </label>
              <select
                {...register('targetIntake')}
                className="input-field"
              >
                <option value="">Select your target intake</option>
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2025">Spring 2025</option>
                <option value="Fall 2025">Fall 2025</option>
                <option value="Spring 2026">Spring 2026</option>
              </select>
              {errors.targetIntake && (
                <p className="mt-1 text-sm text-red-600">{errors.targetIntake.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Preferred Countries
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {COUNTRIES.map((country) => (
                  <label key={country} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(watchedValues.preferredCountries || []).includes(country)}
                      onChange={() => handleCountryToggle(country)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{country}</span>
                  </label>
                ))}
              </div>
              {errors.preferredCountries && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredCountries.message}</p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Annual Budget (USD)
              </label>
              <input
                {...register('budget', { valueAsNumber: true })}
                type="number"
                className="input-field"
                placeholder="e.g., 30000"
              />
              {errors.budget && (
                <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Funding Plan
              </label>
              <select
                {...register('fundingPlan')}
                className="input-field"
              >
                <option value="">Select your funding plan</option>
                <option value="Self-funded">Self-funded</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Loan">Loan</option>
                <option value="Mixed">Mixed</option>
              </select>
              {errors.fundingPlan && (
                <p className="mt-1 text-sm text-red-600">{errors.fundingPlan.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  IELTS Score (Optional)
                </label>
                <input
                  {...register('ielts', { valueAsNumber: true })}
                  type="number"
                  step="0.5"
                  className="input-field"
                  placeholder="e.g., 7.0"
                />
                {errors.ielts && (
                  <p className="mt-1 text-sm text-red-600">{errors.ielts.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  TOEFL Score (Optional)
                </label>
                <input
                  {...register('toefl', { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="e.g., 100"
                />
                {errors.toefl && (
                  <p className="mt-1 text-sm text-red-600">{errors.toefl.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GRE Score (Optional)
                </label>
                <input
                  {...register('gre', { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="e.g., 320"
                />
                {errors.gre && (
                  <p className="mt-1 text-sm text-red-600">{errors.gre.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GMAT Score (Optional)
                </label>
                <input
                  {...register('gmat', { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="e.g., 650"
                />
                {errors.gmat && (
                  <p className="mt-1 text-sm text-red-600">{errors.gmat.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SOP Status
              </label>
              <select
                {...register('sopStatus')}
                className="input-field"
              >
                <option value="">Select your SOP status</option>
                <option value="Not started">Not started</option>
                <option value="Draft">Draft</option>
                <option value="Ready">Ready</option>
              </select>
              {errors.sopStatus && (
                <p className="mt-1 text-sm text-red-600">{errors.sopStatus.message}</p>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Profile Information Complete
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Your profile will be used to provide personalized university recommendations and guidance.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Next Steps
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    After completing onboarding, you'll be able to:
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 mt-1 space-y-1">
                    <li>• Discover universities that match your profile</li>
                    <li>• Get personalized recommendations from AI Counsellor</li>
                    <li>• Shortlist and lock universities</li>
                    <li>• Access application guidance and to-do lists</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Education:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{watchedValues.educationLevel}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Degree:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{watchedValues.degree}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Major:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{watchedValues.major}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Graduation Year:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{watchedValues.graduationYear}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">GPA:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{watchedValues.gpa || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Intended Degree:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{watchedValues.intendedDegree}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">${watchedValues.budget?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Countries:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{(watchedValues.preferredCountries || []).join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Complete Your Profile</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Tell us about your academic background and goals to get personalized guidance</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                step.id <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <step.icon className="h-4 w-4" />
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-4 transition-colors ${
                  index + 1 < currentStep ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          {steps.map((step) => (
            <span key={step.id}>{step.title}</span>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (

              <button
                type="submit"
                disabled={isLoading || !isValid}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Completing...
                  </>
                ) : (
                  'Complete Profile'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Onboarding