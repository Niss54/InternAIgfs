import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, MessageSquare, Moon, Sun, Smartphone, Mail } from 'lucide-react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Customize your experience and preferences
          </p>
        </div>

        {/* Settings Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Appearance Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the app looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="dark-mode" className="text-base font-medium">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Moon className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage how you receive updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications" className="text-base font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="whatsapp-alerts" className="text-base font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get instant alerts on WhatsApp
                  </p>
                </div>
                <Switch
                  id="whatsapp-alerts"
                  checked={whatsappAlerts}
                  onCheckedChange={setWhatsappAlerts}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Settings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Mobile Settings
            </CardTitle>
            <CardDescription>
              Configure mobile-specific preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-base font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Currently {emailNotifications ? 'enabled' : 'disabled'} based on your email notification settings
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base font-medium">WhatsApp Integration</Label>
                <p className="text-sm text-muted-foreground">
                  {whatsappAlerts ? 'Connected and active' : 'Not connected - enable WhatsApp alerts to activate'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center">
          <button className="btn-neon">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;