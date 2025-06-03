
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { LogIn, KeyRound, User } from 'lucide-react';
import LoadingAnimation from '@/components/LoadingAnimation';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});



const SignIn = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define default values for the form
  const defaultValues = {
    email: '',
    password: ''
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/wallet');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    form.setValue('email', 'demo@example.com');
    form.setValue('password', 'password123');
    await onSubmit({ email: 'demo@example.com', password: 'password123' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md bg-secondary/30 border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gradient">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="your.email@example.com" 
                            className="pl-10 bg-secondary/50 border-white/10 focus-visible:ring-lavender" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10 bg-secondary/50 border-white/10 focus-visible:ring-lavender" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        <Link to="#" className="text-xs text-lavender hover:underline">
                          Forgot your password?
                        </Link>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-lavender hover:bg-lavender-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <LoadingAnimation type="spinner" size="sm" />
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" /> Sign In
                    </>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs text-white/60">
                <span className="bg-background px-2">or</span>
              </div>
            </div>
            
            <Button 
              variant="outline"
              className="w-full mb-4 border-lavender text-lavender hover:bg-lavender/20"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
            >
              Use Demo Account
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-white/60">
              Don't have an account?{' '}
              <Link to="/signup" className="text-lavender hover:underline">Sign Up</Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignIn;
