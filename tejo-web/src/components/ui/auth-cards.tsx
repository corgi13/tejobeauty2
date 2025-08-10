"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { MovingBorder } from "./moving-border";
import { BackgroundGradient } from "./background-gradient";

// Validation schemas
const signInSchema = z.object({
  email: z.string().email("Unesite valjanu email adresu"),
  password: z.string().min(6, "Lozinka mora imati najmanje 6 znakova"),
  rememberMe: z.boolean().optional(),
});

const signUpSchema = z.object({
  firstName: z.string().min(2, "Ime mora imati najmanje 2 znaka"),
  lastName: z.string().min(2, "Prezime mora imati najmanje 2 znaka"),
  email: z.string().email("Unesite valjanu email adresu"),
  phone: z.string().min(9, "Unesite valjan broj telefona"),
  password: z.string().min(8, "Lozinka mora imati najmanje 8 znakova"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Morate prihvatiti uvjete korištenja",
  }),
  marketingEmails: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Lozinke se ne podudaraju",
  path: ["confirmPassword"],
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

interface AuthCardsProps {
  className?: string;
  defaultMode?: "signin" | "signup";
  onSuccess?: (data: any) => void;
  onModeChange?: (mode: "signin" | "signup") => void;
}

export const AuthCards: React.FC<AuthCardsProps> = ({
  className,
  defaultMode = "signin",
  onSuccess,
  onModeChange,
}) => {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      marketingEmails: false,
    },
  });

  const handleModeChange = (newMode: "signin" | "signup") => {
    setMode(newMode);
    onModeChange?.(newMode);
  };

  const onSignInSubmit = async (data: SignInForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSuccess?.(data);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUpSubmit = async (data: SignUpForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSuccess?.(data);
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFieldError = (error?: string) => {
    if (!error) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-red-500 text-sm mt-1"
      >
        <AlertCircle className="w-4 h-4" />
        {error}
      </motion.div>
    );
  };

  const renderInput = (
    name: keyof SignInForm | keyof SignUpForm,
    placeholder: string,
    type: string = "text",
    icon: React.ReactNode,
    error?: string,
    showToggle?: boolean,
    onToggle?: () => void
  ) => (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-onyx-400">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500",
            "bg-white/50 backdrop-blur-sm",
            error ? "border-red-300" : "border-cream-200 hover:border-gold-300"
          )}
          {...(mode === "signin" 
          ? signInForm.register(name as keyof SignInForm) 
          : signUpForm.register(name as keyof SignUpForm)
        )}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-onyx-400 hover:text-onyx-600 transition-colors"
          >
            {type === "password" ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        )}
      </div>
      {renderFieldError(error)}
    </div>
  );

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <AnimatePresence mode="wait">
        {mode === "signin" ? (
          <motion.div
            key="signin"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative"
          >
            <BackgroundGradient className="absolute inset-0 rounded-2xl" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-onyx-800 mb-2"
                >
                  Dobrodošli nazad
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-onyx-600"
                >
                  Prijavite se na svoj račun
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-6">
                {renderInput(
                  "email",
                  "Email adresa",
                  "email",
                  <Mail className="w-5 h-5" />,
                  signInForm.formState.errors.email?.message
                )}

                {renderInput(
                  "password",
                  "Lozinka",
                  showPassword ? "text" : "password",
                  <Lock className="w-5 h-5" />,
                  signInForm.formState.errors.password?.message,
                  true,
                  () => setShowPassword(!showPassword)
                )}

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative"
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        {...signInForm.register("rememberMe")}
                      />
                      <div className={cn(
                        "w-5 h-5 border-2 rounded transition-all duration-200",
                        "group-hover:border-gold-400",
                        signInForm.watch("rememberMe")
                          ? "bg-gold-500 border-gold-500"
                          : "border-onyx-300"
                      )}>
                        {signInForm.watch("rememberMe") && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                    <span className="text-sm text-onyx-600 group-hover:text-onyx-800 transition-colors">
                      Zapamti me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-gold-600 hover:text-gold-700 transition-colors"
                  >
                    Zaboravili ste lozinku?
                  </a>
                </div>

                <MovingBorder className="rounded-lg">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                      />
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Prijavi se
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </motion.button>
                </MovingBorder>
              </form>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mt-6"
              >
                <p className="text-onyx-600">
                  Nemate račun?{" "}
                  <button
                    onClick={() => handleModeChange("signup")}
                    className="text-gold-600 hover:text-gold-700 font-medium transition-colors"
                  >
                    Registrirajte se
                  </button>
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative"
          >
            <BackgroundGradient className="absolute inset-0 rounded-2xl" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <User className="w-8 h-8 text-white" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-onyx-800 mb-2"
                >
                  Kreirajte račun
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-onyx-600"
                >
                  Pridružite se Tejo-Beauty zajednici
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {renderInput(
                    "firstName",
                    "Ime",
                    "text",
                    <User className="w-5 h-5" />,
                    signUpForm.formState.errors.firstName?.message
                  )}
                  {renderInput(
                    "lastName",
                    "Prezime",
                    "text",
                    <User className="w-5 h-5" />,
                    signUpForm.formState.errors.lastName?.message
                  )}
                </div>

                {renderInput(
                  "email",
                  "Email adresa",
                  "email",
                  <Mail className="w-5 h-5" />,
                  signUpForm.formState.errors.email?.message
                )}

                {renderInput(
                  "phone",
                  "Broj telefona",
                  "tel",
                  <Phone className="w-5 h-5" />,
                  signUpForm.formState.errors.phone?.message
                )}

                {renderInput(
                  "password",
                  "Lozinka",
                  showPassword ? "text" : "password",
                  <Lock className="w-5 h-5" />,
                  signUpForm.formState.errors.password?.message,
                  true,
                  () => setShowPassword(!showPassword)
                )}

                {renderInput(
                  "confirmPassword",
                  "Potvrdite lozinku",
                  showConfirmPassword ? "text" : "password",
                  <Lock className="w-5 h-5" />,
                  signUpForm.formState.errors.confirmPassword?.message,
                  true,
                  () => setShowConfirmPassword(!showConfirmPassword)
                )}

                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative mt-0.5"
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        {...signUpForm.register("acceptTerms")}
                      />
                      <div className={cn(
                        "w-5 h-5 border-2 rounded transition-all duration-200",
                        "group-hover:border-gold-400",
                        signUpForm.watch("acceptTerms")
                          ? "bg-gold-500 border-gold-500"
                          : "border-onyx-300"
                      )}>
                        {signUpForm.watch("acceptTerms") && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                    <span className="text-sm text-onyx-600 group-hover:text-onyx-800 transition-colors">
                      Prihvaćam{" "}
                      <a href="#" className="text-gold-600 hover:text-gold-700 underline">
                        uvjete korištenja
                      </a>{" "}
                      i{" "}
                      <a href="#" className="text-gold-600 hover:text-gold-700 underline">
                        politiku privatnosti
                      </a>
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative"
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        {...signUpForm.register("marketingEmails")}
                      />
                      <div className={cn(
                        "w-5 h-5 border-2 rounded transition-all duration-200",
                        "group-hover:border-gold-400",
                        signUpForm.watch("marketingEmails")
                          ? "bg-gold-500 border-gold-500"
                          : "border-onyx-300"
                      )}>
                        {signUpForm.watch("marketingEmails") && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                    <span className="text-sm text-onyx-600 group-hover:text-onyx-800 transition-colors">
                      Želim primati emailove o novostima i ponudama
                    </span>
                  </label>
                </div>

                <MovingBorder className="rounded-lg">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                      />
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Kreiraj račun
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </motion.button>
                </MovingBorder>
              </form>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mt-6"
              >
                <p className="text-onyx-600">
                  Već imate račun?{" "}
                  <button
                    onClick={() => handleModeChange("signin")}
                    className="text-gold-600 hover:text-gold-700 font-medium transition-colors"
                  >
                    Prijavite se
                  </button>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};