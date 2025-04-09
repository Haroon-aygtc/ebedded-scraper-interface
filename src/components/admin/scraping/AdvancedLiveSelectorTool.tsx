import React, { useState } from "react";
import LiveSelector from "./LiveSelector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Selector } from "@/types/scraping";
import { Globe, RefreshCw, Check } from "lucide-react";

interface AdvancedLiveSelectorToolProps {
  initialUrl?: string;
  onSaveSelectors?: (selectors: Selector[]) => void;
}

const AdvancedLiveSelectorTool: React.FC<AdvancedLiveSelectorToolProps> = ({
  initialUrl = "",
  onSaveSelectors = () => {},
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [isLiveSelectorOpen, setIsLiveSelectorOpen] = useState(false);
  const [savedSelectors, setSavedSelectors] = useState<Selector[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOpenLiveSelector = () => {
    if (url.trim()) {
      setIsLiveSelectorOpen(true);
    }
  };

  const handleCloseLiveSelector = () => {
    setIsLiveSelectorOpen(false);
  };

  const handleSaveSelectors = (selectors: Selector[]) => {
    setSavedSelectors(selectors);
    setIsLiveSelectorOpen(false);

    // Simulate saving to backend
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      onSaveSelectors(selectors);

      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Live Selector Tool</CardTitle>
          <CardDescription>
            Visually select elements from a webpage to create CSS selectors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-6">
              <div className="sm:col-span-3">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-end sm:col-span-1">
                <Button
                  onClick={handleOpenLiveSelector}
                  disabled={!url.trim()}
                  className="w-full"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Open Selector
                </Button>
              </div>
            </div>

            {savedSelectors.length > 0 && (
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">
                    {savedSelectors.length} selector
                    {savedSelectors.length !== 1 ? "s" : ""} saved
                  </h3>
                  {isSaving ? (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </div>
                  ) : saveSuccess ? (
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <Check className="mr-2 h-4 w-4" />
                      Saved successfully
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isLiveSelectorOpen && (
        <LiveSelector
          url={url}
          onClose={handleCloseLiveSelector}
          onSave={handleSaveSelectors}
        />
      )}
    </div>
  );
};

export default AdvancedLiveSelectorTool;
