import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  Download,
  Trash2,
  FileJson,
  FileText,
  FileCode,
  Calendar,
  Clock,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { ScrapingResult } from "@/types/scraping";

const ScrapingHistoryPage = () => {
  const [scrapingHistory, setScrapingHistory] = useState<ScrapingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<ScrapingResult | null>(
    null,
  );
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("json");

  useEffect(() => {
    // Simulate fetching scraping history
    const fetchScrapingHistory = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockHistory: ScrapingResult[] = Array.from({ length: 10 }).map(
          (_, index) => ({
            id: `result-${index + 1}`,
            configId: index % 2 === 0 ? "config-1" : "config-2",
            url: `https://example.com/page${index + 1}`,
            data: {
              title: `Page ${index + 1} Title`,
              content: `This is the content of page ${index + 1}. It contains sample text that would be extracted from the actual webpage.`,
            },
            metadata: {
              title: `Page ${index + 1} Title`,
              description: `Description for page ${index + 1}`,
              keywords: ["sample", "test", `keyword${index + 1}`],
              author: "Test Author",
              publishedDate: new Date(
                Date.now() - index * 86400000,
              ).toISOString(),
            },
            links: [
              `https://example.com/link${index + 1}/1`,
              `https://example.com/link${index + 1}/2`,
              `https://example.com/link${index + 1}/3`,
            ],
            images: [
              `https://example.com/image${index + 1}/1.jpg`,
              `https://example.com/image${index + 1}/2.jpg`,
              `https://example.com/image${index + 1}/3.jpg`,
            ],
            timestamp: new Date(Date.now() - index * 86400000),
            status:
              index % 5 === 0
                ? "failed"
                : index % 4 === 0
                  ? "partial"
                  : "success",
            error: index % 5 === 0 ? "Connection timeout" : undefined,
          }),
        );

        setScrapingHistory(mockHistory);
      } catch (error) {
        console.error("Error fetching scraping history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScrapingHistory();
  }, []);

  const handleViewResult = (result: ScrapingResult) => {
    setSelectedResult(result);
    setShowResultDialog(true);
  };

  const handleDeleteResult = (resultId: string) => {
    setScrapingHistory(
      scrapingHistory.filter((result) => result.id !== resultId),
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>;
      case "partial":
        return <Badge className="bg-yellow-500">Partial</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const renderResultContent = () => {
    if (!selectedResult) return null;

    switch (activeTab) {
      case "json":
        return (
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm font-mono">
            {JSON.stringify(selectedResult, null, 2)}
          </pre>
        );
      case "data":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">URL</h3>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                {selectedResult.url}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Title</h3>
              <p className="text-sm bg-gray-100 p-2 rounded">
                {selectedResult.data.title}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Content</h3>
              <p className="text-sm bg-gray-100 p-2 rounded whitespace-pre-wrap">
                {selectedResult.data.content}
              </p>
            </div>
            {selectedResult.metadata && (
              <div>
                <h3 className="text-sm font-medium mb-2">Metadata</h3>
                <div className="bg-gray-100 p-2 rounded">
                  <p className="text-sm">
                    <strong>Description:</strong>{" "}
                    {selectedResult.metadata.description}
                  </p>
                  <p className="text-sm">
                    <strong>Author:</strong> {selectedResult.metadata.author}
                  </p>
                  <p className="text-sm">
                    <strong>Published:</strong>{" "}
                    {selectedResult.metadata.publishedDate}
                  </p>
                  <p className="text-sm">
                    <strong>Keywords:</strong>{" "}
                    {selectedResult.metadata.keywords?.join(", ")}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case "links":
        return (
          <div>
            <h3 className="text-sm font-medium mb-2">
              Links ({selectedResult.links?.length || 0})
            </h3>
            {selectedResult.links && selectedResult.links.length > 0 ? (
              <ul className="space-y-1">
                {selectedResult.links.map((link, index) => (
                  <li
                    key={index}
                    className="text-sm font-mono bg-gray-100 p-2 rounded"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No links found</p>
            )}
          </div>
        );
      case "images":
        return (
          <div>
            <h3 className="text-sm font-medium mb-2">
              Images ({selectedResult.images?.length || 0})
            </h3>
            {selectedResult.images && selectedResult.images.length > 0 ? (
              <ul className="space-y-1">
                {selectedResult.images.map((image, index) => (
                  <li
                    key={index}
                    className="text-sm font-mono bg-gray-100 p-2 rounded"
                  >
                    {image}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No images found</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Scraping History</CardTitle>
              <CardDescription>
                View and manage your past web scraping results
              </CardDescription>
            </div>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : scrapingHistory.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">
                No scraping history found. Run a scraping task to see results
                here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scrapingHistory.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium truncate max-w-[300px]">
                      {result.url}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(result.timestamp)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(result.status)}
                      {result.error && (
                        <p className="text-xs text-red-500 mt-1">
                          {result.error}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewResult(result)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteResult(result.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Result Detail Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Scraping Result</DialogTitle>
            <DialogDescription>
              Detailed view of the scraping result for {selectedResult?.url}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{selectedResult?.url}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {selectedResult && formatDate(selectedResult.timestamp)}
                </span>
                {selectedResult && getStatusBadge(selectedResult.status)}
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="json" className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  JSON
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Data
                </TabsTrigger>
                <TabsTrigger value="links" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Links
                </TabsTrigger>
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  Images
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px] w-full">
                {renderResultContent()}
              </ScrollArea>
            </Tabs>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResultDialog(false)}
            >
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScrapingHistoryPage;
