import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Globe,
  FileJson,
  FileText,
  FileCode,
  List,
  Plus,
  Trash2,
  Play,
  Download,
  Save,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Link as LinkIcon,
  Image as ImageIcon,
  FileDown,
  Eye,
  Code,
  Layers,
  Copy,
} from "lucide-react";

import LiveSelector from "./LiveSelector";
import DataExportOptions from "./DataExportOptions";
import { ScrapingOptions } from "@/types/scraping";

// Define the schema for URL validation
const urlSchema = z.string().url({ message: "Invalid URL format" });

// Define the schema for JSON URL array validation
const jsonUrlsSchema = z.string().refine(
  (value) => {
    try {
      const parsed = JSON.parse(value);
      return (
        Array.isArray(parsed) &&
        parsed.every(
          (url) => typeof url === "string" && urlSchema.safeParse(url).success,
        )
      );
    } catch {
      return false;
    }
  },
  {
    message: "Invalid JSON format. Expected an array of valid URLs",
  },
);

const ScrapingConfigurator = () => {
  const [activeTab, setActiveTab] = useState("url-input");
  const [urls, setUrls] = useState<string[]>([]);
  const [singleUrl, setSingleUrl] = useState("");
  const [jsonUrls, setJsonUrls] = useState("");
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [scrapingOptions, setScrapingOptions] = useState<ScrapingOptions>({
    includeMetadata: true,
    includeHeaders: false,
    includeFooters: false,
    includeLinks: true,
    includeImages: true,
    followPagination: false,
    followInternalLinks: false,
    maxDepth: 1,
    maxPages: 10,
    delay: 1000,
    stealthMode: false,
    exportFormat: "json",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [scrapingResults, setScrapingResults] = useState<any>(null);
  const [selectedSelectorGroups, setSelectedSelectorGroups] = useState<
    string[]
  >([]);
  const [showLiveSelector, setShowLiveSelector] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  // Handle single URL input
  const handleAddSingleUrl = () => {
    const result = urlSchema.safeParse(singleUrl);
    if (result.success) {
      if (!urls.includes(singleUrl)) {
        setUrls([...urls, singleUrl]);
        setSingleUrl("");
      }
    }
  };

  // Handle JSON URL input
  const handleAddJsonUrls = () => {
    const result = jsonUrlsSchema.safeParse(jsonUrls);
    if (result.success) {
      try {
        const parsedUrls = JSON.parse(jsonUrls) as string[];
        const uniqueUrls = parsedUrls.filter((url) => !urls.includes(url));
        setUrls([...urls, ...uniqueUrls]);
        setJsonUrls("");
        setIsJsonValid(true);
      } catch {
        setIsJsonValid(false);
      }
    } else {
      setIsJsonValid(false);
    }
  };

  // Format JSON input
  const formatJsonUrls = () => {
    try {
      const parsed = JSON.parse(jsonUrls);
      if (Array.isArray(parsed)) {
        setJsonUrls(JSON.stringify(parsed, null, 2));
        setIsJsonValid(true);
      }
    } catch {
      // If parsing fails, try to extract URLs from the text
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const extractedUrls = jsonUrls.match(urlRegex) || [];
      if (extractedUrls.length > 0) {
        setJsonUrls(JSON.stringify(extractedUrls, null, 2));
        setIsJsonValid(true);
      }
    }
  };

  // Remove URL from list
  const removeUrl = (urlToRemove: string) => {
    setUrls(urls.filter((url) => url !== urlToRemove));
  };

  // Handle option changes
  const handleOptionChange = (key: keyof ScrapingOptions, value: any) => {
    setScrapingOptions({
      ...scrapingOptions,
      [key]: value,
    });
  };

  // Start scraping
  const startScraping = () => {
    if (urls.length === 0) return;

    setIsLoading(true);

    // Simulate scraping process
    setTimeout(() => {
      // Mock results
      const mockResults = urls.map((url) => ({
        url,
        title: `Page title for ${new URL(url).hostname}`,
        content: `Sample content scraped from ${url}`,
        links: ["https://example.com/page1", "https://example.com/page2"],
        images: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg",
        ],
      }));

      setScrapingResults(mockResults);
      setIsLoading(false);
    }, 2000);
  };

  // Export results
  const exportResults = (format: "json" | "csv" | "text" | "html") => {
    if (!scrapingResults) return;

    let content = "";
    let filename = `scraping-results-${new Date().toISOString()}`;
    let type = "";

    switch (format) {
      case "json":
        content = JSON.stringify(scrapingResults, null, 2);
        type = "application/json";
        filename += ".json";
        break;
      case "csv":
        // Simple CSV conversion
        const headers = ["url", "title", "content"];
        content = headers.join(",") + "\n";
        scrapingResults.forEach((result: any) => {
          content += `"${result.url}","${result.title}","${result.content.replace(/"/g, '""')}"\n`;
        });
        type = "text/csv";
        filename += ".csv";
        break;
      case "text":
        scrapingResults.forEach((result: any) => {
          content += `URL: ${result.url}\nTitle: ${result.title}\nContent: ${result.content}\n\n`;
        });
        type = "text/plain";
        filename += ".txt";
        break;
      case "html":
        content = `<!DOCTYPE html>\n<html>\n<head>\n<title>Scraping Results</title>\n</head>\n<body>\n`;
        scrapingResults.forEach((result: any) => {
          content += `<div class="result">\n<h2>${result.title}</h2>\n<p><strong>URL:</strong> <a href="${result.url}">${result.url}</a></p>\n<div class="content">${result.content}</div>\n</div>\n<hr>\n`;
        });
        content += `</body>\n</html>`;
        type = "text/html";
        filename += ".html";
        break;
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Open live selector
  const openLiveSelector = (url: string) => {
    setCurrentUrl(url);
    setShowLiveSelector(true);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Web Scraping Tool</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="url-input" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            URL Input
          </TabsTrigger>
          <TabsTrigger
            value="scraping-options"
            className="flex items-center gap-2"
          >
            <Layers className="h-4 w-4" />
            Scraping Options
          </TabsTrigger>
          <TabsTrigger
            value="live-selector"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Live Selector
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>

        {/* URL Input Tab */}
        <TabsContent value="url-input" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single URL Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Single URL Input
                </CardTitle>
                <CardDescription>
                  Enter a single URL to scrape content from a specific webpage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com"
                    value={singleUrl}
                    onChange={(e) => setSingleUrl(e.target.value)}
                  />
                  <Button onClick={handleAddSingleUrl}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* JSON URL Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-5 w-5 text-primary" />
                  Bulk URL Input (JSON)
                </CardTitle>
                <CardDescription>
                  Enter multiple URLs in JSON array format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder='["https://example.com", "https://example.org"]'
                  value={jsonUrls}
                  onChange={(e) => {
                    setJsonUrls(e.target.value);
                    setIsJsonValid(true);
                  }}
                  className="font-mono text-sm h-32"
                />
                {!isJsonValid && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Invalid JSON Format</AlertTitle>
                    <AlertDescription>
                      Please enter a valid JSON array of URLs or use the format
                      button
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={formatJsonUrls}>
                    <Code className="h-4 w-4 mr-2" /> Format JSON
                  </Button>
                  <Button onClick={handleAddJsonUrls}>
                    <Plus className="h-4 w-4 mr-2" /> Add URLs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* URL List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5 text-primary" />
                URL List ({urls.length})
              </CardTitle>
              <CardDescription>List of URLs to be scraped</CardDescription>
            </CardHeader>
            <CardContent>
              {urls.length === 0 ? (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground">
                    No URLs added yet. Add URLs using the input fields above.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-64 w-full">
                  <div className="space-y-2">
                    {urls.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Globe className="h-4 w-4 flex-shrink-0 text-primary" />
                          <span className="text-sm truncate">{url}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openLiveSelector(url)}
                            title="Open in Live Selector"
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeUrl(url)}
                            title="Remove URL"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setUrls([])}
                disabled={urls.length === 0}
              >
                Clear All
              </Button>
              <Button
                onClick={() => setActiveTab("scraping-options")}
                disabled={urls.length === 0}
              >
                Continue to Options
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Scraping Options Tab */}
        <TabsContent value="scraping-options" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scraping Configuration</CardTitle>
              <CardDescription>
                Configure how the content should be scraped and processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Content Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Content Options</h3>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includeMetadata">Include Metadata</Label>
                      <p className="text-sm text-muted-foreground">
                        Extract page title, description, and other metadata
                      </p>
                    </div>
                    <Switch
                      id="includeMetadata"
                      checked={scrapingOptions.includeMetadata}
                      onCheckedChange={(checked) =>
                        handleOptionChange("includeMetadata", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includeHeaders">Include Headers</Label>
                      <p className="text-sm text-muted-foreground">
                        Extract header content from the page
                      </p>
                    </div>
                    <Switch
                      id="includeHeaders"
                      checked={scrapingOptions.includeHeaders}
                      onCheckedChange={(checked) =>
                        handleOptionChange("includeHeaders", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includeFooters">Include Footers</Label>
                      <p className="text-sm text-muted-foreground">
                        Extract footer content from the page
                      </p>
                    </div>
                    <Switch
                      id="includeFooters"
                      checked={scrapingOptions.includeFooters}
                      onCheckedChange={(checked) =>
                        handleOptionChange("includeFooters", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includeLinks">Include Links</Label>
                      <p className="text-sm text-muted-foreground">
                        Extract links found on the page
                      </p>
                    </div>
                    <Switch
                      id="includeLinks"
                      checked={scrapingOptions.includeLinks}
                      onCheckedChange={(checked) =>
                        handleOptionChange("includeLinks", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includeImages">Include Images</Label>
                      <p className="text-sm text-muted-foreground">
                        Extract image URLs found on the page
                      </p>
                    </div>
                    <Switch
                      id="includeImages"
                      checked={scrapingOptions.includeImages}
                      onCheckedChange={(checked) =>
                        handleOptionChange("includeImages", checked)
                      }
                    />
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Advanced Options</h3>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="followPagination">
                        Follow Pagination
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically navigate through paginated content
                      </p>
                    </div>
                    <Switch
                      id="followPagination"
                      checked={scrapingOptions.followPagination}
                      onCheckedChange={(checked) =>
                        handleOptionChange("followPagination", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="followInternalLinks">
                        Follow Internal Links
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Follow and scrape internal links within the same domain
                      </p>
                    </div>
                    <Switch
                      id="followInternalLinks"
                      checked={scrapingOptions.followInternalLinks}
                      onCheckedChange={(checked) =>
                        handleOptionChange("followInternalLinks", checked)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxDepth">Maximum Depth</Label>
                    <p className="text-sm text-muted-foreground">
                      Maximum depth level for following links (1-10)
                    </p>
                    <Input
                      id="maxDepth"
                      type="number"
                      min="1"
                      max="10"
                      value={scrapingOptions.maxDepth}
                      onChange={(e) =>
                        handleOptionChange(
                          "maxDepth",
                          parseInt(e.target.value) || 1,
                        )
                      }
                      disabled={!scrapingOptions.followInternalLinks}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPages">Maximum Pages</Label>
                    <p className="text-sm text-muted-foreground">
                      Maximum number of pages to scrape (1-100)
                    </p>
                    <Input
                      id="maxPages"
                      type="number"
                      min="1"
                      max="100"
                      value={scrapingOptions.maxPages}
                      onChange={(e) =>
                        handleOptionChange(
                          "maxPages",
                          parseInt(e.target.value) || 1,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delay">Request Delay (ms)</Label>
                    <p className="text-sm text-muted-foreground">
                      Delay between requests in milliseconds
                    </p>
                    <Input
                      id="delay"
                      type="number"
                      min="0"
                      step="100"
                      value={scrapingOptions.delay}
                      onChange={(e) =>
                        handleOptionChange(
                          "delay",
                          parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="stealthMode">Stealth Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use headless browser with anti-detection measures
                      </p>
                    </div>
                    <Switch
                      id="stealthMode"
                      checked={scrapingOptions.stealthMode}
                      onCheckedChange={(checked) =>
                        handleOptionChange("stealthMode", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Export Format */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Export Format</h3>
                <Separator className="mb-4" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${scrapingOptions.exportFormat === "json" ? "border-primary bg-primary/5" : "hover:border-gray-400"}`}
                    onClick={() => handleOptionChange("exportFormat", "json")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <FileJson
                        className={`h-8 w-8 mb-2 ${scrapingOptions.exportFormat === "json" ? "text-primary" : "text-gray-500"}`}
                      />
                      <span className="font-medium">JSON</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Structured data
                      </span>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${scrapingOptions.exportFormat === "csv" ? "border-primary bg-primary/5" : "hover:border-gray-400"}`}
                    onClick={() => handleOptionChange("exportFormat", "csv")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <FileText
                        className={`h-8 w-8 mb-2 ${scrapingOptions.exportFormat === "csv" ? "text-primary" : "text-gray-500"}`}
                      />
                      <span className="font-medium">CSV</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Tabular data
                      </span>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${scrapingOptions.exportFormat === "text" ? "border-primary bg-primary/5" : "hover:border-gray-400"}`}
                    onClick={() => handleOptionChange("exportFormat", "text")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <FileText
                        className={`h-8 w-8 mb-2 ${scrapingOptions.exportFormat === "text" ? "text-primary" : "text-gray-500"}`}
                      />
                      <span className="font-medium">Plain Text</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Clean text only
                      </span>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${scrapingOptions.exportFormat === "html" ? "border-primary bg-primary/5" : "hover:border-gray-400"}`}
                    onClick={() => handleOptionChange("exportFormat", "html")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <FileCode
                        className={`h-8 w-8 mb-2 ${scrapingOptions.exportFormat === "html" ? "text-primary" : "text-gray-500"}`}
                      />
                      <span className="font-medium">HTML</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Structured HTML
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab("url-input")}
              >
                Back to URLs
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("live-selector")}
                >
                  <Eye className="h-4 w-4 mr-2" /> Configure Selectors
                </Button>
                <Button
                  onClick={startScraping}
                  disabled={isLoading || urls.length === 0}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />{" "}
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" /> Start Scraping
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Live Selector Tab */}
        <TabsContent value="live-selector">
          {showLiveSelector ? (
            <LiveSelector
              url={currentUrl}
              onClose={() => setShowLiveSelector(false)}
              onSave={(selectors) => {
                console.log("Saved selectors:", selectors);
                setShowLiveSelector(false);
              }}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Live Selector</CardTitle>
                <CardDescription>
                  Visually select elements from webpages to create selector
                  groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 border rounded-md">
                  <div className="flex flex-col items-center gap-4">
                    <Eye className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">
                        Select a URL to start
                      </h3>
                      <p className="text-muted-foreground">
                        Choose a URL from your list to open the live selector
                        tool
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Select value={currentUrl} onValueChange={setCurrentUrl}>
                        <SelectTrigger className="w-[350px]">
                          <SelectValue placeholder="Select a URL" />
                        </SelectTrigger>
                        <SelectContent>
                          {urls.map((url, index) => (
                            <SelectItem key={index} value={url}>
                              {url}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => setShowLiveSelector(true)}
                        disabled={!currentUrl}
                      >
                        Open Selector
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("scraping-options")}
                >
                  Back to Options
                </Button>
                <Button
                  onClick={() => setActiveTab("results")}
                  disabled={!scrapingResults}
                >
                  View Results
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Scraping Results</CardTitle>
              <CardDescription>
                View and export the scraped data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!scrapingResults ? (
                <div className="text-center py-12 border rounded-md">
                  <div className="flex flex-col items-center gap-4">
                    <FileDown className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">No results yet</h3>
                      <p className="text-muted-foreground">
                        Configure your scraping options and start scraping to
                        see results
                      </p>
                    </div>
                    <Button
                      onClick={() => setActiveTab("scraping-options")}
                      className="mt-4"
                    >
                      Configure Scraping
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      {scrapingResults.length} URLs Processed
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportResults("json")}
                      >
                        <FileJson className="h-4 w-4 mr-2" /> Export JSON
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportResults("csv")}
                      >
                        <FileText className="h-4 w-4 mr-2" /> Export CSV
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportResults("text")}
                      >
                        <FileText className="h-4 w-4 mr-2" /> Export Text
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportResults("html")}
                      >
                        <FileCode className="h-4 w-4 mr-2" /> Export HTML
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <ScrollArea className="h-[400px] w-full">
                    <div className="space-y-4">
                      {scrapingResults.map((result: any, index: number) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:bg-gray-50"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-medium">
                              {result.title}
                            </h4>
                            <Badge variant="outline">
                              {new URL(result.url).hostname}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline flex items-center gap-1"
                            >
                              <Globe className="h-3 w-3" /> {result.url}
                            </a>
                          </p>
                          <div className="mt-4">
                            <h5 className="text-sm font-medium mb-2">
                              Content Preview:
                            </h5>
                            <div className="bg-gray-50 p-3 rounded-md text-sm">
                              {result.content.substring(0, 200)}...
                            </div>
                          </div>
                          {result.links && result.links.length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                <LinkIcon className="h-3 w-3" /> Links (
                                {result.links.length}):
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {result.links
                                  .slice(0, 3)
                                  .map((link: string, i: number) => (
                                    <Badge key={i} variant="secondary">
                                      {new URL(link).pathname}
                                    </Badge>
                                  ))}
                                {result.links.length > 3 && (
                                  <Badge variant="outline">
                                    +{result.links.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          {result.images && result.images.length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" /> Images (
                                {result.images.length}):
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {result.images
                                  .slice(0, 3)
                                  .map((image: string, i: number) => (
                                    <Badge key={i} variant="secondary">
                                      {new URL(image).pathname.split("/").pop()}
                                    </Badge>
                                  ))}
                                {result.images.length > 3 && (
                                  <Badge variant="outline">
                                    +{result.images.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const text = JSON.stringify(result, null, 2);
                                navigator.clipboard.writeText(text);
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" /> Copy JSON
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab("scraping-options")}
              >
                Back to Options
              </Button>
              <Button
                onClick={startScraping}
                disabled={isLoading || urls.length === 0}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" /> Scrape Again
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScrapingConfigurator;
