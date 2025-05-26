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
import { LogIn } from 'lucide-react';

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
import { 
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

// Form validation schema for username login
const usernameLoginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  loginMethod: z.literal('username')
});

// Form validation schema for email login
const emailLoginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  loginMethod: z.literal('email')
});

// Combined schema with discriminated union
const loginFormSchema = z.discriminatedUnion('loginMethod', [
  usernameLoginSchema,
  emailLoginSchema
]);

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginPage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'username' | 'email'>('username');
  
  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
      loginMethod: 'username'
    },
  });

  // Handle login method change
  const handleLoginMethodChange = (value: 'username' | 'email') => {
    setLoginMethod(value);
    form.setValue('loginMethod', value);
    
    // Clear the fields when switching
    if (value === 'username') {
      form.setValue('username', '');
      form.unregister('email');
    } else {
      form.setValue('email', '');
      form.unregister('username');
    }
  };

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    try {
      console.log('Login attempt with:', data);
      
      const email = data.loginMethod === 'email' ? data.email : `${data.username}@example.com`;
      const success = await login(email, data.password);
      
      if (success) {
        toast({
          title: "Success!",
          description: "You've successfully logged in.",
        });
        
        // Redirect to dashboard after successful login
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Please check your credentials and try again.",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your credentials and try again.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t('appName')}</h1>
        <p className="text-sm text-muted-foreground">{t('appSubtitle')}</p>
      </div>

      <div className="w-full p-6 space-y-4 bg-white rounded-lg shadow-md">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Login</h2>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Login with:</p>
              <RadioGroup
                defaultValue="username"
                value={loginMethod}
                onValueChange={(value) => handleLoginMethodChange(value as 'username' | 'email')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="username" id="username-option" />
                  <Label htmlFor="username-option">Username</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email-option" />
                  <Label htmlFor="email-option">Email</Label>
                </div>
              </RadioGroup>
            </div>

            {loginMethod === 'username' ? (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="yourusername" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isLoading}>
              <LogIn className="mr-2 h-4 w-4" />
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
