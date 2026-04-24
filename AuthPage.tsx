/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Card, Button } from '@/src/components/UI';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/src/store/useStore';
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { auth } from '@/src/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.mode !== 'signup');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('other');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (location.state?.mode === 'signup') {
      setIsLogin(false);
    }
  }, [location.state]);

  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      
      setUser({ 
        name: googleUser.displayName || "LifeLine User", 
        email: googleUser.email || "", 
        healthScore: 78,
        avatar: googleUser.photoURL || `https://api.dicebear.com/7.x/open-peeps/svg?seed=${googleUser.uid}`,
        emergencyContacts: [],
        familyMembers: [],
        healthHistory: []
      });
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site or try opening the app in a new tab.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized in Firebase Console. Please ensure you have added the current URL to the Authorized Domains list.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('The sign-in popup was closed before finishing. Please try again.');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = result.user;
        setUser({
          name: fbUser.displayName || fbUser.email?.split('@')[0] || "User",
          email: fbUser.email || "",
          healthScore: 78,
          avatar: `https://api.dicebear.com/7.x/open-peeps/svg?seed=${fbUser.uid}`,
          emergencyContacts: [],
          familyMembers: [],
          healthHistory: []
        });
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = result.user;
        
        // Generate avatar based on gender
        const avatarStyle = gender === 'male' ? 'adventurer' : gender === 'female' ? 'adventurer' : 'open-peeps';
        const avatarUrl = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${fbUser.uid}&flip=true`;

        setUser({
          name: name || fbUser.email?.split('@')[0] || "User",
          email: fbUser.email || "",
          healthScore: 60,
          gender: gender,
          avatar: avatarUrl,
          emergencyContacts: [],
          familyMembers: [],
          healthHistory: []
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <motion.div
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {isLogin ? "Welcome Back" : "Join the Ecosystem"}
          </h1>
          <p className="text-slate-500">
            {isLogin ? "Enter your credentials to access your vitals." : "Start protected health journey today."}
          </p>
        </div>

        <Card className="px-8 py-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-bold">
                {error}
              </div>
            )}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}
            
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {['male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={cn(
                        "py-2 rounded-xl text-xs font-bold capitalize transition-all border",
                        gender === g 
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" 
                          : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Forgot password?</button>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full font-black h-12" 
              isLoading={isLoading}
            >
              {isLogin ? (
                <span className="flex items-center gap-2">Sign In <LogIn className="w-4 h-4" /></span>
              ) : (
                <span className="flex items-center gap-2">Create Account <UserPlus className="w-4 h-4" /></span>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center space-y-4">
            <p className="text-sm text-slate-500">
              {isLogin ? "New to LifeLineX?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-blue-600 hover:underline"
              >
                {isLogin ? "Create an account" : "Sign in now"}
              </button>
            </p>
            
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase">
              <div className="flex-1 h-px bg-slate-100" />
              <span>Or join using</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleGoogleSignIn}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                type="button"
                disabled={isLoading}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" referrerPolicy="no-referrer" />
                <span className="text-sm font-bold text-slate-900">Google</span>
              </button>
            </div>
          </div>
        </Card>

        {!isLogin && (
          <p className="text-[10px] text-center text-slate-400 px-8">
            By creating an account, you agree to our Terms of Service and Privacy Policy, including AI data processing standards.
          </p>
        )}
      </motion.div>
    </div>
  );
}
