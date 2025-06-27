import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

const OtpPage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { loginWithOtp, isLoading, pendingOtpEmail, clearPendingOtp } = useAuth();

  // Redirect if no OTP is pending
  useEffect(() => {
    if (!pendingOtpEmail) {
      navigate('/auth/login');
    }
  }, [pendingOtpEmail, navigate]);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (data: OtpFormValues) => {
    if (!pendingOtpEmail) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No pending OTP verification. Please login again.",
      });
      navigate('/auth/login');
      return;
    }

    try {
      const success = await loginWithOtp(pendingOtpEmail, data.otp);
      
      if (success) {
        toast({
          title: "Success!",
          description: "OTP verified successfully. Welcome back!",
        });
        
        // Role-based routing
        const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (currentUser.role === 'ADMIN') {
          // Admin users go to main dashboard
          navigate("/");
        } else if (currentUser.role === 'STAFF' || currentUser.role === 'MANAGER') {
          // Staff and Manager users go to department dashboard
          navigate("/department-dashboard");
        } else {
          // Fallback to main dashboard
          navigate("/");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "Invalid OTP code. Please check your email and try again.",
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Failed to verify OTP. Please try again.",
      });
    }
  };

  const handleBackToLogin = () => {
    clearPendingOtp();
    navigate('/auth/login');
  };

  // Don't render if no OTP is pending
  if (!pendingOtpEmail) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{t('appName')}</h1>
          <p className="text-sm text-gray-600">{t('appSubtitle')}</p>
        </div>

        <div className="w-full p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Verify Your Identity</h2>
              <p className="text-sm text-gray-600 mt-2">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-sm font-medium text-blue-600 mt-1">
                {pendingOtpEmail}
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Please check your email and enter the verification code below
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Enter Verification Code
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123456" 
                        type="text" 
                        maxLength={6}
                        className="text-center text-xl font-mono tracking-widest h-12 border-2 focus:border-blue-500"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify & Continue'
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center space-y-4">
            <div className="text-xs text-gray-500">
              Didn't receive the code? Check your spam folder or
            </div>
            <Button
              variant="ghost"
              onClick={handleBackToLogin}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage; 