import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Loader2, ShieldOff } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [siteDown, setSiteDown] = useState(false);
  const [siteDownMessage, setSiteDownMessage] = useState('האתר בתחזוקה זמנית, נחזור בקרוב!');

  const isAdmin = (email: string) =>
    email?.toLowerCase() === 'e0556770172@gmail.com';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // בדיקת סטטוס אתר
    const checkSiteStatus = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'site_down')
        .single();
      if (data?.value === 'true') setSiteDown(true);
      const { data: msgData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'site_down_message')
        .single();
      if (msgData?.value) setSiteDownMessage(msgData.value);
    };
    checkSiteStatus();

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  // אתר מושבת – אדמין רואה הכל, שאר המשתמשים רואים מסך חסימה
  if (siteDown && (!user || !isAdmin(user.email))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6" dir="rtl">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-blue-500/20 p-6 rounded-full">
              <ShieldOff size={64} className="text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">האתר אינו זמין כרגע</h1>
          <p className="text-blue-200 text-lg leading-relaxed">{siteDownMessage}</p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-blue-300">
            צוות האתר עובד על שיפורים ויחזור בהקדם האפשרי.
          </div>
        </div>
      </div>
    );
  }

  return user
    ? <Dashboard user={user} siteDown={siteDown} setSiteDown={setSiteDown} siteDownMessage={siteDownMessage} setSiteDownMessage={setSiteDownMessage} />
    : <Auth />;
}
