"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BiometricsChart from "@/components/BiometricsChart";
import BiometricsForm from "@/components/BiometricsForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import ProfileForm from "../components/ProfileForm";
import BreathingExercise from "@/components/BreathingExercise";
import Footer from "@/components/Footer";
import { Menu, X, Bell, BellOff, Phone, User2, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export default function UserDashboard() {
  const { authState, signOut } = useAuth();
  const [tab, setTab] = useState("status");
  const [profile, setProfile] = useState({ 
    username: "", 
    age: "", 
    height: "", 
    avatar_url: "",
    phone: "",
    doctor_phone: "",
    alert_enabled: false,
    doctor_alert_enabled: false,
    emergency_contact: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [latestMetrics, setLatestMetrics] = useState(null);
  const [stressScore, setStressScore] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [stressLogs, setStressLogs] = useState([]);
  const [timeFilter, setTimeFilter] = useState('24h');
  const [manualAlertOpen, setManualAlertOpen] = useState(false);
  const [alertHistory, setAlertHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    lastSeen: null
  });

  // Stress state thresholds
  const STRESS_LOW = 0.3;
  const STRESS_HIGH = 0.7;
  const STRESS_CRITICAL = 0.9;

  // Blinking effect for moderate stress
  useEffect(() => {
    if (stressScore >= STRESS_LOW && stressScore < STRESS_HIGH) {
      const interval = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setIsBlinking(false);
    }
  }, [stressScore]);

  // Check connection status periodically
  useEffect(() => {
    const checkConnection = () => {
      if (latestMetrics) {
        const now = new Date();
        const lastSeen = new Date(latestMetrics.recorded_at);
        const minutesSinceLastSeen = (now - lastSeen) / (1000 * 60);
        
        setConnectionStatus({
          connected: minutesSinceLastSeen < 5, // 5 minute threshold
          lastSeen: lastSeen
        });
      }
    };

    const interval = setInterval(checkConnection, 60000); // Check every minute
    checkConnection(); // Initial check
    
    return () => clearInterval(interval);
  }, [latestMetrics]);

  // Check for high stress and trigger alerts
  useEffect(() => {
    if (stressScore >= STRESS_CRITICAL && profile.alert_enabled) {
      triggerAlert("automatic", "Critical stress level detected");
    } else if (stressScore >= STRESS_HIGH && profile.alert_enabled) {
      triggerAlert("automatic", "High stress level detected");
    }
  }, [stressScore]);

  const fetchProfile = async () => {
    if (!authState.user?.id) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authState.user.id)
      .single();

    if (!error && data) {
      setProfile({
        username: data.username ?? "",
        age: data.age?.toString() ?? "",
        height: data.height?.toString() ?? "",
        avatar_url: data.avatar_url ?? "",
        phone: data.phone ?? "",
        doctor_phone: data.doctor_phone ?? "",
        alert_enabled: data.alert_enabled ?? false,
        doctor_alert_enabled: data.doctor_alert_enabled ?? false,
        emergency_contact: data.emergency_contact ?? ""
      });
    }
  };

  const fetchLatestMetrics = async () => {
    if (!authState.user?.id) return;
    const { data } = await supabase
      .from("biometrics")
      .select("gsr, heartbeat, spo2, temperature, stress_score, recorded_at, headband_connected")
      .eq("user_id", authState.user.id)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setLatestMetrics(data);
      setStressScore(data.stress_score ?? calculateStressScore(data));
      setConnectionStatus({
        connected: data.headband_connected,
        lastSeen: new Date(data.recorded_at)
      });
    }
  };

  const fetchStressLogs = async () => {
    if (!authState.user?.id) return;
    const { data } = await supabase
      .from("biometrics")
      .select("*")
      .eq("user_id", authState.user.id)
      .gte("stress_score", STRESS_HIGH)
      .order("recorded_at", { ascending: false })
      .limit(50);

    if (data) setStressLogs(data);
  };

  const fetchAlertHistory = async () => {
    if (!authState.user?.id) return;
    const { data } = await supabase
      .from("alerts")
      .select("*")
      .eq("user_id", authState.user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) setAlertHistory(data);
  };

  const calculateStressScore = (metrics) => {
    if (!metrics) return 0;
    
    const {
      gsr = 0,
      heartbeat = 0,
      spo2 = 100,
      temperature = 0
    } = metrics;

    const GSR_NORMAL = 1500;
    const HR_NORMAL = 72;
    const TEMP_NORMAL = 36.5;
    const SPO2_NORMAL = 98;
    const GSR_THRESHOLD = 2500;
    const HR_THRESHOLD = 80;
    const TEMP_THRESHOLD = 37.2;
    const SPO2_THRESHOLD = 95;

    const gsrFactor = Math.max(0, gsr - GSR_NORMAL) / (GSR_THRESHOLD - GSR_NORMAL);
    const hrFactor = Math.max(0, heartbeat - HR_NORMAL) / (HR_THRESHOLD - HR_NORMAL);
    const tempFactor = Math.max(0, temperature - TEMP_NORMAL) / (TEMP_THRESHOLD - TEMP_NORMAL);
    const spo2Factor = Math.max(0, SPO2_NORMAL - spo2) / (SPO2_NORMAL - SPO2_THRESHOLD);
    
    return (gsrFactor * 0.3) +
           (hrFactor * 0.25) +
           (tempFactor * 0.2) +
           (spo2Factor * 0.25);
  };

  const triggerAlert = async (type, reason) => {
    if (!authState.user?.id) return;
    
    const alertData = {
      user_id: authState.user.id,
      type,
      reason,
      stress_level: stressScore,
      status: "triggered",
      headband_connected: connectionStatus.connected
    };

    const { error } = await supabase.from("alerts").insert(alertData);
    
    if (error) {
      console.error("Error saving alert:", error);
      return;
    }

    if (profile.alert_enabled && profile.phone) {
      const userMessage = `MindEase Alert: ${reason}. Your current stress level is ${Math.round(stressScore * 100)}%.`;
      await sendSMS(profile.phone, userMessage);
    }

    if (profile.doctor_alert_enabled && profile.doctor_phone) {
      const doctorMessage = `Patient Alert: ${profile.username || "User"} is experiencing ${reason}. Current stress level: ${Math.round(stressScore * 100)}%.`;
      await sendSMS(profile.doctor_phone, doctorMessage);
    }

    if (profile.emergency_contact && stressScore >= STRESS_CRITICAL) {
      const emergencyMessage = `Emergency Alert: ${profile.username || "User"} is in critical condition. Stress level: ${Math.round(stressScore * 100)}%.`;
      await sendSMS(profile.emergency_contact, emergencyMessage);
    }

    fetchAlertHistory();
    toast.info(`Alert triggered: ${reason}`);
  };

  const sendSMS = async (phoneNumber, message) => {
    try {
      console.log(`Sending SMS to ${phoneNumber}: ${message}`);
      return true;
    } catch (error) {
      console.error("Error sending SMS:", error);
      return false;
    }
  };

  const handleManualAlert = () => {
    triggerAlert("manual", "Manually triggered alert");
    setManualAlertOpen(false);
  };

  useEffect(() => {
    fetchProfile();
    fetchLatestMetrics();
    fetchStressLogs();
    fetchAlertHistory();
    
    const channel = supabase
      .channel('biometrics')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'biometrics',
        filter: `user_id=eq.${authState.user?.id}`
      }, (payload) => {
        setLatestMetrics(payload.new);
        const newScore = payload.new.stress_score ?? calculateStressScore(payload.new);
        setStressScore(newScore);
        setConnectionStatus({
          connected: payload.new.headband_connected,
          lastSeen: new Date(payload.new.recorded_at)
        });
        
        if (newScore >= STRESS_HIGH) {
          setStressLogs(prev => [payload.new, ...prev.slice(0, 49)]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authState.user]);

  const uploadAvatar = async () => {
    if (!avatarFile || !authState.user) return null;
    const ext = avatarFile.name.split(".").pop();
    const path = `${authState.user.id}/avatar.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, {
        upsert: true,
        cacheControl: "3600",
        contentType: avatarFile.type
      });

    if (error) {
      toast.error("Avatar upload failed: " + error.message);
      return null;
    }

    return supabase.storage.from("avatars").getPublicUrl(path).data?.publicUrl ?? null;
  };

  const saveProfile = async () => {
    if (!authState.user?.id) return;
    let avatar_url = profile.avatar_url;

    if (avatarFile) {
      const url = await uploadAvatar();
      if (url) avatar_url = url;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: authState.user.id,
      username: profile.username.trim(),
      age: Number(profile.age) || null,
      height: Number(profile.height) || null,
      avatar_url,
      phone: profile.phone,
      doctor_phone: profile.doctor_phone,
      alert_enabled: profile.alert_enabled,
      doctor_alert_enabled: profile.doctor_alert_enabled,
      emergency_contact: profile.emergency_contact
    });

    if (!error) {
      toast.success("Profile updated!");
      setAvatarFile(null);
      setSheetOpen(false);
      fetchProfile();
    } else {
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const getStressState = () => {
    if (stressScore < STRESS_LOW) {
      return {
        text: "Relaxed 😊",
        color: "bg-green-500",
        icon: "🟢"
      };
    } else if (stressScore < STRESS_HIGH) {
      return {
        text: "Moderate Stress 😐",
        color: isBlinking ? "bg-green-500" : "bg-green-600",
        icon: "🟡"
      };
    } else if (stressScore < STRESS_CRITICAL) {
      return {
        text: "High Stress 😖",
        color: "bg-orange-500",
        icon: "🟠"
      };
    } else {
      return {
        text: "Critical Stress 🚨",
        color: "bg-red-500",
        icon: "🔴"
      };
    }
  };

  const filteredLogs = stressLogs.filter(log => {
    const logTime = new Date(log.recorded_at).getTime();
    const now = Date.now();
    
    if (timeFilter === '24h') return now - logTime <= 24 * 60 * 60 * 1000;
    if (timeFilter === 'week') return now - logTime <= 7 * 24 * 60 * 60 * 1000;
    return true;
  });

  const stressState = getStressState();

  const ConnectionStatusBadge = () => (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      connectionStatus.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {connectionStatus.connected ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Disconnected</span>
        </>
      )}
      {connectionStatus.lastSeen && (
        <span className="text-xs opacity-70 ml-1">
          {new Date(connectionStatus.lastSeen).toLocaleTimeString()}
        </span>
      )}
    </div>
  );

  const StressLogComponent = () => (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Stress Events Log</h3>
        <div className="flex gap-2">
          <Button 
            variant={timeFilter === '24h' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeFilter('24h')}
          >
            Last 24h
          </Button>
          <Button 
            variant={timeFilter === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeFilter('week')}
          >
            Last Week
          </Button>
          <Button 
            variant={timeFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeFilter('all')}
          >
            All Time
          </Button>
        </div>
      </div>
      
      {filteredLogs.length === 0 ? (
        <Card className="p-4 text-center text-gray-500">
          No high stress events recorded in this period
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log, index) => {
            const severity = log.stress_score >= STRESS_CRITICAL ? 'critical' : 
                           log.stress_score >= STRESS_HIGH ? 'high' : 'moderate';
            
            return (
              <Card 
                key={index}
                className={`p-4 border-l-4 transition-all ${
                  severity === 'critical' ? 'border-red-500 bg-red-50' :
                  severity === 'high' ? 'border-orange-500 bg-orange-50' :
                  'border-yellow-500 bg-yellow-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {new Date(log.recorded_at).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm">
                        Stress: <span className="font-semibold">{Math.round(log.stress_score * 100)}%</span>
                      </p>
                      <div className={`flex items-center gap-1 text-xs ${
                        log.headband_connected ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {log.headband_connected ? (
                          <Wifi className="w-3 h-3" />
                        ) : (
                          <WifiOff className="w-3 h-3" />
                        )}
                        <span>{log.headband_connected ? 'Connected' : 'Disconnected'}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    severity === 'critical' ? 'bg-red-500 text-white' :
                    severity === 'high' ? 'bg-orange-500 text-white' :
                    'bg-yellow-500 text-gray-800'
                  }`}>
                    {severity === 'critical' ? 'Critical' : 
                     severity === 'high' ? 'High' : 'Moderate'}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">HR:</span>
                    <span>{log.heartbeat} BPM</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">GSR:</span>
                    <span>{log.gsr}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Temp:</span>
                    <span>{log.temperature?.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">SpO2:</span>
                    <span>{log.spo2}%</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const AlertSettingsComponent = () => (
    <div className="mt-6 space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" /> Alert Settings
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="alerts-toggle">Enable Alerts</Label>
              <p className="text-sm text-gray-500">Receive SMS notifications for high stress levels</p>
            </div>
            <Switch
              id="alerts-toggle"
              checked={profile.alert_enabled}
              onCheckedChange={(checked) => setProfile({...profile, alert_enabled: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="doctor-alerts">Doctor Alerts</Label>
              <p className="text-sm text-gray-500">Notify your doctor during critical events</p>
            </div>
            <Switch
              id="doctor-alerts"
              checked={profile.doctor_alert_enabled}
              onCheckedChange={(checked) => setProfile({...profile, doctor_alert_enabled: checked})}
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Your Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                placeholder="+1234567890"
              />
            </div>
            
            <div>
              <Label htmlFor="doctor-phone">Doctor's Phone Number</Label>
              <Input
                id="doctor-phone"
                type="tel"
                value={profile.doctor_phone}
                onChange={(e) => setProfile({...profile, doctor_phone: e.target.value})}
                placeholder="+1234567890"
              />
            </div>
            
            <div>
              <Label htmlFor="emergency-contact">Emergency Contact</Label>
              <Input
                id="emergency-contact"
                type="tel"
                value={profile.emergency_contact}
                onChange={(e) => setProfile({...profile, emergency_contact: e.target.value})}
                placeholder="+1234567890"
              />
              <p className="text-sm text-gray-500 mt-1">Will be notified during critical events</p>
            </div>
          </div>
          
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => setManualAlertOpen(true)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" /> Trigger Manual Alert
          </Button>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" /> Alert History
        </h3>
        <div className="space-y-3">
          {alertHistory.length > 0 ? (
            alertHistory.map((alert, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{alert.reason}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(alert.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                      {alert.type}
                    </span>
                    <div className={`text-xs px-1.5 py-0.5 rounded-full ${
                      alert.headband_connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {alert.headband_connected ? 'Connected' : 'Disconnected'}
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-sm">
                  Stress level: {Math.round(alert.stress_level * 100)}%
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No alert history found
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile header with hamburger menu */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          {mobileSidebarOpen ? <X /> : <Menu />}
        </Button>
        <h1 className="text-xl font-bold">MindEase</h1>
        <div className="w-10"></div>
      </div>

      {/* Flex row: sidebar + main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${mobileSidebarOpen ? 'block' : 'hidden'} lg:block w-64 bg-white border-r p-4 space-y-4 fixed lg:static h-full z-50 lg:z-auto`}>
          <h1 className="text-xl font-bold mb-4 hidden lg:block">MindEase</h1>
          {["status", "exercises", "alerts"].map((k) => (
            <Button 
              key={k} 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                setTab(k);
                setMobileSidebarOpen(false);
              }}
            >
              {k[0].toUpperCase() + k.slice(1)}
            </Button>
          ))}
        </aside>

        {/* Main content */}
        <main className={`flex-1 p-4 lg:p-6 bg-gray-50 flex flex-col ${mobileSidebarOpen ? 'ml-64' : ''} lg:ml-0`}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold">Hello, {profile.username || "User"}</h2>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="flex items-center gap-2">
                <ConnectionStatusBadge />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className={`px-3 py-1 sm:px-4 sm:py-2 rounded-xl shadow text-white text-sm font-semibold ${stressState.color}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{stressState.icon}</span>
                      <span className="hidden sm:inline">{stressState.text}</span>
                      <span className="sm:ml-2 text-xs opacity-80">({Math.round(stressScore * 100)}%)</span>
                    </div>
                  </Card>
                </motion.div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback>{profile.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setSheetOpen(true); }}>
                    Edit profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleLogout(); }} className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent side="right" className="w-[90vw] sm:w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
              </SheetHeader>
              <ProfileForm
                profile={profile}
                setProfile={setProfile}
                avatarFile={avatarFile}
                setAvatarFile={setAvatarFile}
                onSave={saveProfile}
              />
              
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">Alert Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Your Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      placeholder="+1234567890"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="doctor-phone">Doctor's Phone Number</Label>
                    <Input
                      id="doctor-phone"
                      type="tel"
                      value={profile.doctor_phone}
                      onChange={(e) => setProfile({...profile, doctor_phone: e.target.value})}
                      placeholder="+1234567890"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergency-contact">Emergency Contact</Label>
                    <Input
                      id="emergency-contact"
                      type="tel"
                      value={profile.emergency_contact}
                      onChange={(e) => setProfile({...profile, emergency_contact: e.target.value})}
                      placeholder="+1234567890"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="alerts-toggle">Enable Alerts</Label>
                    <Switch
                      id="alerts-toggle"
                      checked={profile.alert_enabled}
                      onCheckedChange={(checked) => setProfile({...profile, alert_enabled: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="doctor-alerts">Enable Doctor Alerts</Label>
                    <Switch
                      id="doctor-alerts"
                      checked={profile.doctor_alert_enabled}
                      onCheckedChange={(checked) => setProfile({...profile, doctor_alert_enabled: checked})}
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Manual Alert Dialog */}
          <Dialog open={manualAlertOpen} onOpenChange={setManualAlertOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Trigger Emergency Alert
                </DialogTitle>
                <DialogDescription>
                  This will send emergency notifications to your contacts and doctor.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <p className="font-medium">Are you sure you want to send an emergency alert?</p>
                <p className="text-sm text-gray-500 mt-2">
                  Current stress level: {Math.round(stressScore * 100)}%
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm">Headband status:</span>
                  <ConnectionStatusBadge />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setManualAlertOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleManualAlert}>
                  Send Emergency Alert
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {tab === "status" && (
              <Tabs defaultValue="charts">
                <TabsList className="mb-6 w-full sm:w-auto">
                  <TabsTrigger value="charts" className="flex-1 sm:flex-none">Dashboard</TabsTrigger>
                  <TabsTrigger value="push" className="flex-1 sm:flex-none">Push Test Data</TabsTrigger>
                </TabsList>

                <TabsContent value="charts">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <BiometricsChart type="gsr" title="GSR" />
                    <BiometricsChart type="heartbeat" title="Heart Rate" />
                    <BiometricsChart type="spo2" title="SpO₂" />
                    <BiometricsChart type="temperature" title="Temperature" />
                  </div>
                  <StressLogComponent />
                </TabsContent>

                <TabsContent value="push">
                  <div className="max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow">
                    <h2 className="text-lg font-semibold mb-4">Push Biometric Test Data</h2>
                    <BiometricsForm />
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {tab === "exercises" && (
              <div className="text-lg">
                <BreathingExercise />
              </div>
            )}
            
            {tab === "alerts" && (
              <AlertSettingsComponent />
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}