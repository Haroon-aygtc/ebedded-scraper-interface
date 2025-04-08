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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  ExternalLink,
  Eye,
  RefreshCw,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ScrapingProblem {
  id: string;
  url: string;
  type: "error" | "warning" | "info";
  message: string;
  timestamp: Date;
  status: "new" | "investigating" | "resolved";
  details?: string;
}

const ScrapingProblemsPage = () => {
  const [problems, setProblems] = useState<ScrapingProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] =
    useState<ScrapingProblem | null>(null);

  useEffect(() => {
    // Simulate fetching problems
    const fetchProblems = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProblems([
          {
            id: "1",
            url: "https://example.com/products",
            type: "error",
            message: "Failed to access page - 403 Forbidden",
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            status: "new",
            details:
              "The website is blocking automated access. Consider using stealth mode or custom headers.",
          },
          {
            id: "2",
            url: "https://example.com/category/electronics",
            type: "warning",
            message: "Selector '.product-price' matched 0 elements",
            timestamp: new Date(Date.now() - 7200000), // 2 hours ago
            status: "investigating",
            details:
              "The website may have changed its structure. Verify the selector or update it.",
          },
          {
            id: "3",
            url: "https://example.com/blog",
            type: "info",
            message: "Rate limiting detected - slow down requests",
            timestamp: new Date(Date.now() - 10800000), // 3 hours ago
            status: "resolved",
            details:
              "The website has rate limiting in place. Increased delay between requests to 5 seconds.",
          },
          {
            id: "4",
            url: "https://example.com/contact",
            type: "error",
            message: "JavaScript rendering required",
            timestamp: new Date(Date.now() - 14400000), // 4 hours ago
            status: "new",
            details:
              "This page requires JavaScript to render content. Consider using a headless browser.",
          },
          {
            id: "5",
            url: "https://example.com/search?q=test",
            type: "warning",
            message: "CAPTCHA detected",
            timestamp: new Date(Date.now() - 18000000), // 5 hours ago
            status: "investigating",
            details:
              "The website is showing a CAPTCHA challenge. Manual intervention may be required.",
          },
        ]);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleStatusChange = (
    problemId: string,
    newStatus: ScrapingProblem["status"],
  ) => {
    setProblems(
      problems.map((problem) =>
        problem.id === problemId ? { ...problem, status: newStatus } : problem,
      ),
    );

    if (selectedProblem?.id === problemId) {
      setSelectedProblem({ ...selectedProblem, status: newStatus });
    }
  };

  const getStatusBadge = (status: ScrapingProblem["status"]) => {
    switch (status) {
      case "new":
        return <Badge variant="destructive">New</Badge>;
      case "investigating":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Investigating
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Resolved
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: ScrapingProblem["type"]) => {
    switch (type) {
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Problems List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Potential Problems</CardTitle>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </div>
              <CardDescription>
                Issues detected during web scraping
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : problems.length === 0 ? (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground">
                    No problems detected. All scraping tasks are running
                    smoothly.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {problems.map((problem) => (
                      <div
                        key={problem.id}
                        className={`p-3 border rounded-md cursor-pointer transition-all ${selectedProblem?.id === problem.id ? "border-primary bg-primary/5" : "hover:border-gray-400"}`}
                        onClick={() => setSelectedProblem(problem)}
                      >
                        <div className="flex items-start gap-3">
                          {getTypeIcon(problem.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium truncate">
                                {problem.message}
                              </h3>
                              {getStatusBadge(problem.status)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {problem.url}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {problem.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Problem Details */}
        <div className="md:col-span-2">
          {selectedProblem ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedProblem.type)}
                    <CardTitle>{selectedProblem.message}</CardTitle>
                  </div>
                  {getStatusBadge(selectedProblem.status)}
                </div>
                <CardDescription>
                  Detected on {selectedProblem.timestamp.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">URL</h3>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 p-2 rounded text-sm flex-1 break-all">
                      {selectedProblem.url}
                    </code>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-1" /> Visit
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Details</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>{selectedProblem.details}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={
                        selectedProblem.status === "new" ? "default" : "outline"
                      }
                      onClick={() =>
                        handleStatusChange(selectedProblem.id, "new")
                      }
                      className="gap-1"
                    >
                      <AlertCircle className="h-4 w-4" /> Mark as New
                    </Button>
                    <Button
                      variant={
                        selectedProblem.status === "investigating"
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        handleStatusChange(selectedProblem.id, "investigating")
                      }
                      className="gap-1"
                    >
                      <Eye className="h-4 w-4" /> Mark as Investigating
                    </Button>
                    <Button
                      variant={
                        selectedProblem.status === "resolved"
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        handleStatusChange(selectedProblem.id, "resolved")
                      }
                      className="gap-1"
                    >
                      <CheckCircle className="h-4 w-4" /> Mark as Resolved
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Recommended Solutions
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Solution</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead className="w-[100px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProblem.type === "error" &&
                        selectedProblem.message.includes("403") && (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">
                                Use stealth mode
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800"
                                >
                                  Easy
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  Apply
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">
                                Add custom user agent
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-100 text-yellow-800"
                                >
                                  Medium
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  Configure
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      {selectedProblem.type === "warning" &&
                        selectedProblem.message.includes("selector") && (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">
                                Update selector
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-100 text-yellow-800"
                                >
                                  Medium
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">
                                Use selector helper
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800"
                                >
                                  Easy
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  Open
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      {selectedProblem.type === "info" &&
                        selectedProblem.message.includes("Rate limiting") && (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">
                                Increase delay between requests
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800"
                                >
                                  Easy
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  Configure
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      {selectedProblem.type === "error" &&
                        selectedProblem.message.includes("JavaScript") && (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">
                                Enable headless browser
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800"
                                >
                                  Advanced
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  Configure
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      {selectedProblem.type === "warning" &&
                        selectedProblem.message.includes("CAPTCHA") && (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">
                                Manual intervention
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800"
                                >
                                  Advanced
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  Guide
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Problem</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Select a problem from the list to view details and recommended
                  solutions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrapingProblemsPage;
