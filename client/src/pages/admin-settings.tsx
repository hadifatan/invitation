import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminSettings() {
  const [telegramLink, setTelegramLink] = useState("");
  const { toast } = useToast();

  const { data: settings } = useQuery<{ key: string; value: string }[]>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      const telegramSetting = settings.find((s) => s.key === "telegram_link");
      if (telegramSetting) {
        setTelegramLink(telegramSetting.value);
      }
    }
  }, [settings]);

  const updateSettingMutation = useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      return await apiRequest("POST", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleUpdateTelegramLink = () => {
    updateSettingMutation.mutate({
      key: "telegram_link",
      value: telegramLink,
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground" data-testid="text-settings-title">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your application settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Telegram Share Link</CardTitle>
            <CardDescription>
              Set the Telegram link that users will be redirected to when sharing invitations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telegram-link">Telegram Link</Label>
              <Input
                id="telegram-link"
                type="url"
                placeholder="https://t.me/yourusername"
                value={telegramLink}
                onChange={(e) => setTelegramLink(e.target.value)}
                data-testid="input-telegram-link"
              />
              <p className="text-xs text-muted-foreground">
                Example: https://t.me/yourusername
              </p>
            </div>
            <Button
              onClick={handleUpdateTelegramLink}
              disabled={updateSettingMutation.isPending}
              data-testid="button-save-telegram-link"
            >
              {updateSettingMutation.isPending ? "Saving..." : "Save Telegram Link"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
