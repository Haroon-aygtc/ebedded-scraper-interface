import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, BarChart2, FileText, Download, RefreshCw } from "lucide-react";

const ScrapingVisualizationPage = () => {
  const [activeTab, setActiveTab] = useState("graph");
  const [url, setUrl] = useState("https://example.com");
  const [loading, setLoading] = useState(false);

  const handleVisualize = () => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Scraping Visualization</CardTitle>
          <CardDescription>
            Visualize website structure and data extraction points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <Button onClick={handleVisualize} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Visualize
                  </>
                )}
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="graph">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  DOM Graph
                </TabsTrigger>
                <TabsTrigger value="heatmap">
                  <Eye className="mr-2 h-4 w-4" />
                  Data Heatmap
                </TabsTrigger>
                <TabsTrigger value="report">
                  <FileText className="mr-2 h-4 w-4" />
                  Analysis Report
                </TabsTrigger>
              </TabsList>

              <TabsContent value="graph" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="bg-slate-100 rounded-md p-4 h-[500px] flex items-center justify-center">
                      <div className="text-center">
                        <BarChart2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 mb-4">
                          {loading
                            ? "Generating DOM graph visualization..."
                            : url
                              ? "Enter a URL and click Visualize to generate a DOM graph"
                              : "DOM structure visualization will appear here"}
                        </p>
                        {!loading && url && (
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export Graph
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="heatmap" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="bg-slate-100 rounded-md p-4 h-[500px] flex items-center justify-center">
                      <div className="text-center">
                        <Eye className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 mb-4">
                          {loading
                            ? "Generating data heatmap..."
                            : "Data density heatmap will appear here"}
                        </p>
                        {!loading && url && (
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export Heatmap
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="report" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <ScrollArea className="h-[500px] w-full pr-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">
                            Structure Analysis
                          </h3>
                          <p className="text-slate-500 text-sm">
                            This website has a typical e-commerce structure with
                            product listings, filters, and detail pages.
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium">Data Points</h3>
                          <ul className="list-disc pl-5 text-sm space-y-2 mt-2">
                            <li>
                              Product titles: <code>.product-title</code>
                            </li>
                            <li>
                              Product prices: <code>.product-price</code>
                            </li>
                            <li>
                              Product images: <code>.product-image img</code>
                            </li>
                            <li>
                              Product descriptions:{" "}
                              <code>.product-description</code>
                            </li>
                          </ul>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium">Pagination</h3>
                          <p className="text-slate-500 text-sm">
                            Pagination is implemented using standard links with
                            page numbers. Selector: <code>.pagination a</code>
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium">
                            JavaScript Dependencies
                          </h3>
                          <p className="text-slate-500 text-sm">
                            This site uses JavaScript for some content loading.
                            Consider using a headless browser for complete data
                            extraction.
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium">
                            Recommended Approach
                          </h3>
                          <p className="text-slate-500 text-sm">
                            Use the provided selectors with a 5-second delay
                            between requests to avoid rate limiting. Extract
                            data from product listing pages first, then visit
                            individual product pages for detailed information.
                          </p>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapingVisualizationPage;
