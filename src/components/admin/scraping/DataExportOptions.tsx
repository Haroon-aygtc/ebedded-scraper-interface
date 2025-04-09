import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileJson,
  FileText,
  FileCode,
  Download,
  Copy,
  Check,
  Link as LinkIcon,
  Image as ImageIcon,
  FileDown,
  Info,
} from "lucide-react";

interface DataExportOptionsProps {
  data: any;
  onExport: (format: string, options: any) => void;
}

const DataExportOptions: React.FC<DataExportOptionsProps> = ({
  data,
  onExport,
}) => {
  const [activeTab, setActiveTab] = useState("json");
  const [copied, setCopied] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    includeHeaders: false,
    includeFooters: false,
    includeLinks: true,
    includeImages: true,
  });

  const handleOptionChange = (option: string, checked: boolean) => {
    setExportOptions({
      ...exportOptions,
      [option]: checked,
    });
  };

  const handleExport = () => {
    onExport(activeTab, exportOptions);
  };

  const handleCopy = () => {
    let content = "";

    switch (activeTab) {
      case "json":
        content = JSON.stringify(data, null, 2);
        break;
      case "csv":
        // Simple CSV conversion
        const headers = ["url", "title", "content"];
        content = headers.join(",") + "\n";
        data.forEach((item: any) => {
          content += `"${item.url}","${item.title}","${item.content.replace(/"/g, '""')}"\n`;
        });
        break;
      case "text":
        data.forEach((item: any) => {
          content += `URL: ${item.url}\nTitle: ${item.title}\nContent: ${item.content}\n\n`;
        });
        break;
      case "html":
        content = `<!DOCTYPE html>\n<html>\n<head>\n<title>Scraping Results</title>\n</head>\n<body>\n`;
        data.forEach((item: any) => {
          content += `<div class="result">\n<h2>${item.title}</h2>\n<p><strong>URL:</strong> <a href="${item.url}">${item.url}</a></p>\n<div class="content">${item.content}</div>\n</div>\n<hr>\n`;
        });
        content += `</body>\n</html>`;
        break;
    }

    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPreview = () => {
    switch (activeTab) {
      case "json":
        return (
          <pre className="bg-muted/30 text-foreground p-4 rounded-md overflow-x-auto text-sm font-mono">
            {JSON.stringify(data.slice(0, 1), null, 2)}
          </pre>
        );
      case "csv":
        return (
          <pre className="bg-muted/30 text-foreground p-4 rounded-md overflow-x-auto text-sm font-mono">
            url,title,content
            {data
              .slice(0, 1)
              .map(
                (item: any) =>
                  `\n"${item.url}","${item.title}","${item.content.substring(0, 30)}..."`,
              )}
          </pre>
        );
      case "text":
        return (
          <pre className="bg-muted/30 text-foreground p-4 rounded-md overflow-x-auto text-sm font-mono">
            {data
              .slice(0, 1)
              .map(
                (item: any) =>
                  `URL: ${item.url}\nTitle: ${item.title}\nContent: ${item.content.substring(0, 30)}...`,
              )}
          </pre>
        );
      case "html":
        return (
          <pre className="bg-muted/30 text-foreground p-4 rounded-md overflow-x-auto text-sm font-mono">
            {`<!DOCTYPE html>\n<html>\n<head>\n<title>Scraping Results</title>\n</head>\n<body>\n<div class="result">\n<h2>${data[0]?.title}</h2>\n<p><strong>URL:</strong> <a href="${data[0]?.url}">${data[0]?.url}</a></p>\n<div class="content">${data[0]?.content.substring(0, 30)}...</div>\n</div>\n</body>\n</html>`}
          </pre>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Options</CardTitle>
        <CardDescription>
          Configure how you want to export the scraped data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="json" className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              JSON
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              CSV
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Plain Text
            </TabsTrigger>
            <TabsTrigger value="html" className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              HTML
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Options */}
            <div>
              <h3 className="text-lg font-medium mb-4">Data to Include</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeMetadata"
                    checked={exportOptions.includeMetadata}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeMetadata", checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="includeMetadata"
                    className="flex items-center gap-2"
                  >
                    <Info className="h-4 w-4 text-blue-500" />
                    Metadata (title, description, etc.)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeHeaders"
                    checked={exportOptions.includeHeaders}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeHeaders", checked as boolean)
                    }
                  />
                  <Label htmlFor="includeHeaders">Headers</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeFooters"
                    checked={exportOptions.includeFooters}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeFooters", checked as boolean)
                    }
                  />
                  <Label htmlFor="includeFooters">Footers</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeLinks"
                    checked={exportOptions.includeLinks}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeLinks", checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="includeLinks"
                    className="flex items-center gap-2"
                  >
                    <LinkIcon className="h-4 w-4 text-blue-500" />
                    Links
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeImages"
                    checked={exportOptions.includeImages}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeImages", checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="includeImages"
                    className="flex items-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                    Images
                  </Label>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex gap-2">
                <Button onClick={handleExport} className="gap-1">
                  <Download className="h-4 w-4" /> Download{" "}
                  {activeTab.toUpperCase()}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <ScrollArea className="h-[300px] w-full">
                {renderPreview()}
              </ScrollArea>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataExportOptions;
