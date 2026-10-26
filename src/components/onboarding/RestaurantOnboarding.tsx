import React, { useState } from 'react';
import { OnboardingStep, RestaurantProfile, KnowledgeDocument } from '../../types';
import {
  Building2,
  Clock,
  FileText,
  Bot,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Sparkles,
  FileUp,
  X,
  ShieldCheck,
  Check,
  ChevronDown
} from 'lucide-react';

interface RestaurantOnboardingProps {
  currentStep: OnboardingStep;
  setStep: (step: OnboardingStep) => void;
  restaurant: RestaurantProfile;
  setRestaurant: React.Dispatch<React.SetStateAction<RestaurantProfile>>;
  onComplete: () => void;
  onBackToPreviousPage?: () => void;
}

export const RestaurantOnboarding: React.FC<RestaurantOnboardingProps> = ({
  currentStep,
  setStep,
  restaurant,
  setRestaurant,
  onComplete,
  onBackToPreviousPage,
}) => {
  // Step 1 State
  const [name, setName] = useState(restaurant.name || '');
  const [address, setAddress] = useState(restaurant.address || '');
  const [phone, setPhone] = useState(restaurant.phone || '');
  const [website, setWebsite] = useState(restaurant.website || '');

  // Step 2 State
  const [type, setType] = useState(restaurant.type || 'Casual Dining');
  const [spend, setSpend] = useState(restaurant.averageSpend || '');
  const [hours, setHours] = useState(restaurant.openingHours);

  // Step 3 State
  const [documents, setDocuments] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState(restaurant.additionalInfo || '');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setRestaurant((prev) => ({
      ...prev,
      name,
      address,
      phone,
      website,
    }));
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setRestaurant((prev) => ({
      ...prev,
      type,
      averageSpend: spend,
      openingHours: hours,
    }));
    setStep(3);
  };

  const handleNextStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setRestaurant((prev) => ({
      ...prev,
      additionalInfo,
    }));
    setStep(4);
  };

  const handleSimulateUpload = () => {
    const sampleFiles = ['Wine_Pairing_List.pdf', 'Private_Dining_Brochure.pdf', 'Daily_Specials.docx'];
    const nextFile = sampleFiles.find((f) => !documents.includes(f)) || `Special_Menu_${Date.now().toString().slice(-4)}.pdf`;
    setDocuments((prev) => [...prev, nextFile]);
    setUploadSuccessToast(`Uploaded ${nextFile}`);
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  const handleRemoveDoc = (docName: string) => {
    setDocuments((prev) => prev.filter((d) => d !== docName));
  };

  const stepLabels = [
    { num: 1, title: 'Restaurant Info', icon: Building2 },
    { num: 2, title: 'Business Info', icon: Clock },
    { num: 3, title: 'Restaurant Knowledge', icon: FileText },
    { num: 4, title: 'AI Setup', icon: Bot },
  ];

  return (
    <div className="min-h-[calc(100vh-42px)] bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-10">
      <div className="max-w-3xl w-full mx-auto space-y-6">
        {/* Top Navigation: Previous Step / Page */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (currentStep > 1) {
                setStep((currentStep - 1) as OnboardingStep);
              } else if (onBackToPreviousPage) {
                onBackToPreviousPage();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentStep > 1 ? `Previous Step` : 'Previous Page (Sign Up)'}</span>
          </button>
          <span className="text-xs text-slate-500 font-medium">Step {currentStep} of 4</span>
        </div>

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-slate-900" />
            <span className="font-medium">Guided Restaurant Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Set up AIVORA for your venue
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Give AIVORA your restaurant details and menus so it can accurately answer guest queries and take reservations.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-2">
            {stepLabels.map((s) => {
              const Icon = s.icon;
              const isCompleted = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setStep(s.num as OnboardingStep)}
                  className={`flex flex-col sm:flex-row items-center sm:items-center gap-2 p-2 rounded-lg text-left transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-100 border border-slate-300 text-slate-900'
                      : isCompleted
                      ? 'text-slate-700 hover:bg-slate-50'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : isCurrent
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold truncate">{s.title}</div>
                    <div className="text-[10px] text-slate-500">
                      {isCompleted ? 'Completed' : isCurrent ? 'In progress' : 'Upcoming'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= STEP 1: RESTAURANT INFORMATION ================= */}
        {currentStep === 1 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Let's set up your restaurant
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your basic venue details. AIVORA uses this to tell guests where you are located and how to reach you.
              </p>
            </div>

            <form onSubmit={handleNextStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bree Street Bistro"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/30 focus:border-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Restaurant Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 123 Bree Street, Cape Town"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/30 focus:border-slate-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +27 21 422 1890"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/30 focus:border-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Website
                  </label>
                  <input
                    type="text"
                    required
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. www.breestreetbistro.co.za"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/30 focus:border-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                {onBackToPreviousPage ? (
                  <button
                    type="button"
                    onClick={onBackToPreviousPage}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Page</span>
                  </button>
                ) : (
                  <div />
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 2: BUSINESS INFORMATION ================= */}
        {currentStep === 2 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Tell us about your restaurant
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure your dining style, operating hours, and average spend so AIVORA can qualify customer booking requests.
              </p>
            </div>

            <form onSubmit={handleNextStep2} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Restaurant Type
                  </label>
                  <div className="relative">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/30 focus:border-slate-900 appearance-none focus:bg-white"
                    >
                      <option value="Fine Dining">Fine Dining</option>
                      <option value="Casual Dining">Casual Dining</option>
                      <option value="Café">Café</option>
                      <option value="Bar & Restaurant">Bar & Restaurant</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Average Guest Spend
                  </label>
                  <input
                    type="text"
                    required
                    value={spend}
                    onChange={(e) => setSpend(e.target.value)}
                    placeholder="e.g. R300"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/30 focus:border-slate-900 focus:bg-white"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Helps AIVORA recommend appropriate tasting menus and table seatings.
                  </span>
                </div>
              </div>

              {/* Opening Hours Schedule */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Opening Hours
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden">
                  {hours.map((item, idx) => (
                    <div key={item.day} className="px-4 py-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 w-28">{item.day}</span>
                      <input
                        type="text"
                        value={item.hours}
                        onChange={(e) => {
                          const newHours = [...hours];
                          newHours[idx].hours = e.target.value;
                          setHours(newHours);
                        }}
                        className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-slate-900 tabular-nums w-44 shadow-2xs"
                      />
                      <span className="text-[11px] text-emerald-600 font-semibold hidden sm:inline">Open</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 3: RESTAURANT KNOWLEDGE ================= */}
        {currentStep === 3 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Give AIVORA the information it needs to answer your customers
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Upload your menus, wine lists, FAQs, and parking guidelines. AIVORA references these exact files when replying to diners.
              </p>
            </div>

            {uploadSuccessToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between animate-fadeIn">
                <span>✓ {uploadSuccessToast}</span>
                <span className="text-[10px] text-emerald-700 font-mono font-semibold">Status: Ready</span>
              </div>
            )}

            <form onSubmit={handleNextStep3} className="space-y-6">
              {/* Document Upload Zone */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Upload your restaurant information
                  </label>
                  <span className="text-[11px] text-slate-500">PDF, DOCX, TXT supported</span>
                </div>

                {/* Dropzone Container */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleSimulateUpload();
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    isDragging
                      ? 'border-slate-800 bg-slate-100'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/70'
                  }`}
                >
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center mx-auto">
                      <FileUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Drag and drop files here
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Menus, beverage lists, FAQs, allergy sheets
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSimulateUpload}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-700" />
                      <span>+ Upload Document</span>
                    </button>
                  </div>
                </div>

                {/* Checkmarked Document List */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs text-slate-500 font-semibold">
                    Ready documents ({documents.length}):
                  </div>
                  {documents.length === 0 ? (
                    <div className="p-4 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      No documents uploaded yet. Click above to upload a menu, FAQ, or policy file.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {documents.map((doc) => (
                        <div
                          key={doc}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-mono text-slate-800 font-medium truncate">{doc}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(doc)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                            title="Remove document"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Additional Information <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={4}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Add information about parking, dress code, dietary options, special events, etc."
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/30 focus:border-slate-900 leading-relaxed focus:bg-white"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  e.g. Valet details, dress code, kids policy, corkage, terrace smoking rules.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 4: SETUP CONFIRMATION ================= */}
        {currentStep === 4 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-8 shadow-sm text-center">
            {/* Status Graphic */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Your restaurant setup is ready
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                AIVORA has registered your restaurant profile, operating hours, and knowledge base. Your operations dashboard is configured.
              </p>
            </div>

            {/* Checklist Box */}
            <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-200 text-left overflow-hidden">
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Restaurant</span>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{restaurant.name || 'Configured'}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </span>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Knowledge Base</span>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="tabular-nums">{documents.length} documents uploaded</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </span>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Opening Hours</span>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Configured</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </span>
              </div>

              <div className="p-3.5 flex items-center justify-between bg-emerald-50/80">
                <span className="text-xs font-semibold text-emerald-900">System Operations</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <span>Ready & Active</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </span>
              </div>
            </div>

            {/* Final CTA with Previous Step Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
              <button
                type="button"
                onClick={onComplete}
                className="w-full sm:flex-1 py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center py-4 text-xs text-slate-400 font-medium">
        Step {currentStep} of 4 · AIVORA Restaurant Operations Suite
      </div>
    </div>
  );
};
