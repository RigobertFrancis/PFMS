/**
 * Login Page Component
 * 
 * This component handles user authentication through a login form.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn, User, Mail } from 'lucide-react';

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

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'username' | 'email'>('username');

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const onSubmitLogin = async (data: LoginFormValues) => {
    try {
      console.log("=== LOGIN ATTEMPT ===");
      console.log("Form data:", data);
      
      const response = await login(data.usernameOrEmail, data.password);
      
      console.log("=== LOGIN RESPONSE ===");
      console.log("Response:", response);
      console.log("Response type:", typeof response);
      console.log("Response.otpSent:", response?.otpSent);
      
      if (response && response.otpSent) {
        console.log("=== REDIRECTING TO OTP ===");
        toast({
          title: "✅ Credentials Verified!",
          description: `OTP sent to ${response.email}. Redirecting to verification page...`,
        });
        
        // Small delay to show the toast before redirecting
        setTimeout(() => {
          navigate("/auth/otp");
        }, 1500);
      } else {
        console.log("=== LOGIN FAILED ===");
        toast({
          variant: "destructive",
          title: "❌ Login Failed",
          description: "Invalid username/email or password. Please try again.",
        });
      }
    } catch (error) {
      console.error('=== LOGIN ERROR ===');
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "❌ Login Error",
        description: "An error occurred during login. Please try again.",
      });
    }
  };

  const handleLoginTypeChange = (type: 'username' | 'email') => {
    setLoginType(type);
    // Clear the field when switching
    loginForm.setValue('usernameOrEmail', '');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t('appName')}</h1>
        <p className="text-sm text-muted-foreground">{t('appSubtitle')}</p>
      </div>

      <div className="w-full p-6 space-y-4 bg-white rounded-lg shadow-md">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Welcome Back</h2>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
          <Button
            type="button"
            variant={loginType === 'username' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => handleLoginTypeChange('username')}
          >
            <User className="mr-1 h-3 w-3" />
            Username
          </Button>
          <Button
            type="button"
            variant={loginType === 'email' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => handleLoginTypeChange('email')}
          >
            <Mail className="mr-1 h-3 w-3" />
            Email
          </Button>
        </div>

        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
            <FormField
              control={loginForm.control}
              name="usernameOrEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {loginType === 'username' ? 'Username' : 'Email Address'}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      {loginType === 'username' ? (
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      ) : (
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      )}
                      <Input 
                        placeholder={
                          loginType === 'username' 
                            ? "Enter your username" 
                            : "Enter your email address"
                        }
                        type={loginType === 'email' ? 'email' : 'text'}
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password" 
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
