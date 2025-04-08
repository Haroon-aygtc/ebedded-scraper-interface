import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MousePointer,
  Code,
  Layers,
  Copy,
  Crosshair,
  FileJson,
  Maximize2,
  Minimize2,
  HelpCircle,
  MoveHorizontal,
  Wand2,
  Hash,
  AtSign,
  Type,
  Star,
  Dot,
  Brackets,
  Check,
} from "lucide-react";
import { Selector } from "@/types/scraping";

interface LiveSelectorProps {
  url: string;
  onClose: () => void;
  onSave: (selectors: Selector[]) => void;
}

const LiveSelector: React.FC<LiveSelectorProps> = ({
  url,
  onClose,
  onSave,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectors, setSelectors] = useState<Selector[]>([]);
  const [currentSelector, setCurrentSelector] = useState<Selector | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectorGroups, setSelectorGroups] = useState<
    { id: string; name: string }[]
  >([
    { id: "1", name: "Main Content" },
    { id: "2", name: "Product Details" },
    { id: "3", name: "Article Content" },
  ]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [activeTab, setActiveTab] = useState("visual");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [draggedSelectorId, setDraggedSelectorId] = useState<string | null>(
    null,
  );
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Simulate loading the webpage and generate mock HTML
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Generate mock HTML for the preview
      const mockHtml = generateMockHtml(url);
      setPreviewHtml(mockHtml);
    }, 2000);

    return () => clearTimeout(timer);
  }, [url]);

  // Generate mock HTML for the preview
  const generateMockHtml = (url: string) => {
    const domain = new URL(url).hostname;
    let template = "";

    if (domain.includes("product") || domain.includes("shop")) {
      template = `
        <div class="product-page">
          <header class="site-header">
            <nav class="main-nav">
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Products</a></li>
                <li><a href="#">Categories</a></li>
                <li><a href="#">Cart</a></li>
              </ul>
            </nav>
          </header>
          <main>
            <div class="product-container">
              <div class="product-gallery">
                <img src="https://via.placeholder.com/400" alt="Product Image" class="product-image" />
                <div class="thumbnail-list">
                  <img src="https://via.placeholder.com/80" alt="Thumbnail 1" />
                  <img src="https://via.placeholder.com/80" alt="Thumbnail 2" />
                  <img src="https://via.placeholder.com/80" alt="Thumbnail 3" />
                </div>
              </div>
              <div class="product-details">
                <h1 class="product-title">Premium Product</h1>
                <div class="product-price">$99.99</div>
                <div class="product-rating">★★★★☆ (42 reviews)</div>
                <p class="product-description">This is a high-quality product with amazing features. It's designed to meet all your needs and exceed your expectations.</p>
                <button class="add-to-cart-button">Add to Cart</button>
              </div>
            </div>
          </main>
          <footer class="site-footer">
            <div class="footer-links">
              <div>About Us</div>
              <div>Contact</div>
              <div>Terms & Conditions</div>
              <div>Privacy Policy</div>
            </div>
          </footer>
        </div>
      `;
    } else if (domain.includes("article") || domain.includes("blog")) {
      template = `
        <div class="article-page">
          <header class="site-header">
            <nav class="main-nav">
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Articles</a></li>
                <li><a href="#">Categories</a></li>
                <li><a href="#">About</a></li>
              </ul>
            </nav>
          </header>
          <main>
            <article class="article">
              <h1 class="article-title">Comprehensive Guide to Web Scraping</h1>
              <div class="article-meta">
                <span class="article-author">By John Doe</span>
                <span class="article-date">Published on May 15, 2023</span>
              </div>
              <div class="article-content">
                <p>Web scraping is a technique used to extract data from websites. This article covers the basics of web scraping and provides practical examples.</p>
                <h2>What is Web Scraping?</h2>
                <p>Web scraping is the process of automatically collecting information from websites. It involves making HTTP requests to web servers, downloading the HTML content, and parsing it to extract the desired data.</p>
              </div>
            </article>
          </main>
          <footer class="site-footer">
            <div class="footer-links">
              <div>About Us</div>
              <div>Contact</div>
              <div>Terms & Conditions</div>
              <div>Privacy Policy</div>
            </div>
          </footer>
        </div>
      `;
    } else {
      template = `
        <div class="generic-page">
          <header class="site-header">
            <nav class="main-nav">
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Products</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </nav>
          </header>
          <main class="content">
            <h1>Welcome to ${domain}</h1>
            <p>This is a sample page content for demonstration purposes.</p>
            <div class="featured-section">
              <h2>Featured Content</h2>
              <div class="featured-items">
                <div class="item">
                  <img src="https://via.placeholder.com/200" alt="Item 1" />
                  <h3>Item 1</h3>
                  <p>Description for item 1</p>
                </div>
                <div class="item">
                  <img src="https://via.placeholder.com/200" alt="Item 2" />
                  <h3>Item 2</h3>
                  <p>Description for item 2</p>
                </div>
                <div class="item">
                  <img src="https://via.placeholder.com/200" alt="Item 3" />
                  <h3>Item 3</h3>
                  <p>Description for item 3</p>
                </div>
              </div>
            </div>
          </main>
          <footer class="site-footer">
            <div class="footer-links">
              <div>About Us</div>
              <div>Contact</div>
              <div>Terms & Conditions</div>
              <div>Privacy Policy</div>
            </div>
          </footer>
        </div>
      `;
    }

    return template;
  };

  // Add a new selector
  const addSelector = () => {
    const newSelector: Selector = {
      id: Date.now().toString(),
      name: `Selector ${selectors.length + 1}`,
      selector: "",
      type: "css",
      description: "",
    };
    setSelectors([...selectors, newSelector]);
    setCurrentSelector(newSelector);
  };

  // Update a selector
  const updateSelector = (id: string, updates: Partial<Selector>) => {
    setSelectors(
      selectors.map((selector) =>
        selector.id === id ? { ...selector, ...updates } : selector,
      ),
    );
    if (currentSelector?.id === id) {
      setCurrentSelector({ ...currentSelector, ...updates });
    }
  };

  // Remove a selector
  const removeSelector = (id: string) => {
    setSelectors(selectors.filter((selector) => selector.id !== id));
    if (currentSelector?.id === id) {
      setCurrentSelector(null);
    }
  };

  // Toggle select mode
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
  };

  // Save selector group
  const saveGroup = () => {
    if (groupName) {
      const newGroup = {
        id: Date.now().toString(),
        name: groupName,
      };
      setSelectorGroups([...selectorGroups, newGroup]);
      setSelectedGroup(newGroup.id);
      setGroupName("");
      setShowSaveDialog(false);
    }
  };

  // Save selectors
  const handleSave = () => {
    onSave(selectors);
  };

  return (
    <div
      className={`flex flex-col h-full ${fullscreenMode ? "fixed inset-0 z-50 bg-white" : ""}`}
    >
      <Card className="flex-1">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Advanced Live Selector Tool</CardTitle>
              <CardDescription>
                Visually select elements from the webpage to create powerful
                selectors
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFullscreenMode(!fullscreenMode)}
                title={fullscreenMode ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {fullscreenMode ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {url}
              </Badge>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isSelectMode ? "default" : "outline"}
                      size="sm"
                      onClick={toggleSelectMode}
                      className="gap-1"
                    >
                      <Crosshair className="h-4 w-4" />
                      {isSelectMode ? "Selecting" : "Select Element"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to toggle element selection mode</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLoading(true)}
                      className="gap-1"
                    >
                      <RefreshCw className="h-4 w-4" /> Reload
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reload the webpage</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() =>
                        setActiveTab(activeTab === "visual" ? "code" : "visual")
                      }
                    >
                      {activeTab === "visual" ? (
                        <>
                          <Code className="h-4 w-4" /> Code View
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" /> Visual View
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle between visual and code view</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="visual" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visual Selector
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                HTML Inspector
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visual" className="h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                {/* Browser Preview */}
                <div className="md:col-span-2 border rounded-md overflow-hidden">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center bg-gray-50">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                        <p className="text-sm text-gray-500">
                          Loading webpage...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full bg-white relative">
                      {/* In a real implementation, this would be an iframe with the actual webpage */}
                      <iframe
                        ref={iframeRef}
                        className="w-full h-full border-0"
                        srcDoc={`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <style>
                                body { font-family: system-ui, sans-serif; }
                                .tempo-highlight { outline: 2px solid #3b82f6 !important; background-color: rgba(59, 130, 246, 0.1) !important; }
                                .tempo-selected { outline: 2px solid #ef4444 !important; background-color: rgba(239, 68, 68, 0.1) !important; }
                              </style>
                            </head>
                            <body>
                              ${previewHtml}
                              <script>
                                // This would be the script to handle element selection
                                document.body.addEventListener('click', (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  
                                  // Remove previous selection
                                  const selected = document.querySelector('.tempo-selected');
                                  if (selected) selected.classList.remove('tempo-selected');
                                  
                                  // Add new selection
                                  e.target.classList.add('tempo-selected');
                                  
                                  // In a real implementation, this would send a message to the parent window
                                  console.log('Selected element:', e.target.tagName, e.target.className);
                                });
                                
                                document.body.addEventListener('mouseover', (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  
                                  // Remove previous highlights
                                  const highlights = document.querySelectorAll('.tempo-highlight');
                                  highlights.forEach(el => el.classList.remove('tempo-highlight'));
                                  
                                  // Add new highlight
                                  if (!e.target.classList.contains('tempo-selected')) {
                                    e.target.classList.add('tempo-highlight');
                                  }
                                });
                                
                                document.body.addEventListener('mouseout', (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  
                                  // Remove highlight
                                  if (e.target.classList.contains('tempo-highlight')) {
                                    e.target.classList.remove('tempo-highlight');
                                  }
                                });
                              </script>
                            </body>
                          </html>
                        `}
                        title="Web Preview"
                        sandbox="allow-same-origin allow-scripts"
                      />

                      {isSelectMode && (
                        <div className="absolute top-2 left-2 right-2 bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700 flex items-center justify-between">
                          <p className="flex items-center gap-1">
                            <MousePointer className="h-4 w-4" /> Click on any
                            element to select it
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={toggleSelectMode}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selector Panel */}
                <div className="border rounded-md overflow-hidden flex flex-col">
                  <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                    <h3 className="font-medium">Selectors</h3>
                    <Button size="sm" onClick={addSelector}>
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>

                  <ScrollArea className="flex-1 p-3">
                    {selectors.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">
                          No selectors added yet. Click "Add" to create a new
                          selector or use the select mode.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectors.map((selector) => (
                          <div
                            key={selector.id}
                            className={`border rounded-md p-2 cursor-pointer transition-all ${currentSelector?.id === selector.id ? "border-primary bg-primary/5" : "hover:border-gray-400"}`}
                            onClick={() => setCurrentSelector(selector)}
                            draggable
                            onDragStart={() =>
                              setDraggedSelectorId(selector.id)
                            }
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDropTargetId(selector.id);
                            }}
                            onDragEnd={() => {
                              if (
                                draggedSelectorId &&
                                dropTargetId &&
                                draggedSelectorId !== dropTargetId
                              ) {
                                // Reorder selectors
                                const newSelectors = [...selectors];
                                const draggedIndex = newSelectors.findIndex(
                                  (s) => s.id === draggedSelectorId,
                                );
                                const dropIndex = newSelectors.findIndex(
                                  (s) => s.id === dropTargetId,
                                );
                                const [removed] = newSelectors.splice(
                                  draggedIndex,
                                  1,
                                );
                                newSelectors.splice(dropIndex, 0, removed);
                                setSelectors(newSelectors);
                              }
                              setDraggedSelectorId(null);
                              setDropTargetId(null);
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1">
                                <MoveHorizontal className="h-3 w-3 text-gray-400 cursor-move" />
                                <div className="font-medium text-sm">
                                  {selector.name}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSelector(selector.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                            {selector.selector && (
                              <div className="mt-1">
                                <Badge
                                  variant="outline"
                                  className="font-mono text-xs"
                                >
                                  {selector.type}:{" "}
                                  {selector.selector.length > 20
                                    ? `${selector.selector.substring(0, 20)}...`
                                    : selector.selector}
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  {currentSelector && (
                    <div className="p-3 border-t bg-gray-50">
                      <h4 className="font-medium text-sm mb-2">
                        Edit Selector
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="selectorName" className="text-xs">
                            Name
                          </Label>
                          <Input
                            id="selectorName"
                            value={currentSelector.name}
                            onChange={(e) =>
                              updateSelector(currentSelector.id, {
                                name: e.target.value,
                              })
                            }
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1">
                            <Label htmlFor="selectorType" className="text-xs">
                              Type
                            </Label>
                            <Select
                              value={currentSelector.type}
                              onValueChange={(value) =>
                                updateSelector(currentSelector.id, {
                                  type: value as "css" | "xpath" | "regex",
                                })
                              }
                            >
                              <SelectTrigger
                                id="selectorType"
                                className="h-8 text-sm"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="css">CSS</SelectItem>
                                <SelectItem value="xpath">XPath</SelectItem>
                                <SelectItem value="regex">Regex</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="selectorValue" className="text-xs">
                              Selector
                            </Label>
                            <div className="flex gap-1">
                              <Input
                                id="selectorValue"
                                value={currentSelector.selector}
                                onChange={(e) =>
                                  updateSelector(currentSelector.id, {
                                    selector: e.target.value,
                                  })
                                }
                                className="h-8 text-sm font-mono flex-1"
                              />
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          currentSelector.selector,
                                        );
                                      }}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Copy selector</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                        {currentSelector.type === "css" && (
                          <div>
                            <Label htmlFor="attribute" className="text-xs">
                              Attribute (optional)
                            </Label>
                            <Input
                              id="attribute"
                              value={currentSelector.attribute || ""}
                              onChange={(e) =>
                                updateSelector(currentSelector.id, {
                                  attribute: e.target.value,
                                })
                              }
                              className="h-8 text-sm"
                              placeholder="e.g., href, src, data-id"
                            />
                          </div>
                        )}
                        <div>
                          <Label htmlFor="description" className="text-xs">
                            Description (optional)
                          </Label>
                          <Input
                            id="description"
                            value={currentSelector.description || ""}
                            onChange={(e) =>
                              updateSelector(currentSelector.id, {
                                description: e.target.value,
                              })
                            }
                            className="h-8 text-sm"
                            placeholder="What this selector extracts"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {/* HTML Code View */}
                <div className="border rounded-md overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                    <h3 className="font-medium">HTML Source</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(previewHtml);
                      }}
                    >
                      <Copy className="h-4 w-4 mr-1" /> Copy
                    </Button>
                  </div>
                  <ScrollArea className="h-[calc(100%-48px)]">
                    <pre className="p-4 text-xs font-mono whitespace-pre-wrap">
                      {previewHtml}
                    </pre>
                  </ScrollArea>
                </div>

                {/* Selector Testing */}
                <div className="border rounded-md overflow-hidden flex flex-col">
                  <div className="p-3 bg-gray-50 border-b">
                    <h3 className="font-medium">CSS Selector Helper</h3>
                  </div>
                  <div className="p-4 space-y-4 flex-1">
                    <Tabs defaultValue="builder" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger
                          value="builder"
                          className="flex items-center gap-2"
                        >
                          <Wand2 className="h-4 w-4" />
                          Selector Builder
                        </TabsTrigger>
                        <TabsTrigger
                          value="tester"
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Selector Tester
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="builder" className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Element Type
                          </Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start"
                            >
                              <Hash className="h-3.5 w-3.5 mr-2 text-blue-500" />{" "}
                              ID
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start"
                            >
                              <Dot className="h-3.5 w-3.5 mr-2 text-green-500" />{" "}
                              Class
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start"
                            >
                              <Type className="h-3.5 w-3.5 mr-2 text-orange-500" />{" "}
                              Tag
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start"
                            >
                              <AtSign className="h-3.5 w-3.5 mr-2 text-purple-500" />{" "}
                              Attribute
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start"
                            >
                              <Star className="h-3.5 w-3.5 mr-2 text-yellow-500" />{" "}
                              Pseudo
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start"
                            >
                              <Brackets className="h-3.5 w-3.5 mr-2 text-red-500" />{" "}
                              Custom
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Common Selectors
                          </Label>
                          <ScrollArea className="h-[120px] border rounded-md p-2">
                            <div className="space-y-1">
                              {[
                                {
                                  name: "Element with ID",
                                  value: "#element-id",
                                  icon: (
                                    <Hash className="h-3.5 w-3.5 text-blue-500" />
                                  ),
                                },
                                {
                                  name: "Element with Class",
                                  value: ".element-class",
                                  icon: (
                                    <Dot className="h-3.5 w-3.5 text-green-500" />
                                  ),
                                },
                                {
                                  name: "Element Type",
                                  value: "div",
                                  icon: (
                                    <Type className="h-3.5 w-3.5 text-orange-500" />
                                  ),
                                },
                                {
                                  name: "Element with Attribute",
                                  value: "[data-attribute=value]",
                                  icon: (
                                    <AtSign className="h-3.5 w-3.5 text-purple-500" />
                                  ),
                                },
                                {
                                  name: "First Child",
                                  value: ":first-child",
                                  icon: (
                                    <Star className="h-3.5 w-3.5 text-yellow-500" />
                                  ),
                                },
                                {
                                  name: "Last Child",
                                  value: ":last-child",
                                  icon: (
                                    <Star className="h-3.5 w-3.5 text-yellow-500" />
                                  ),
                                },
                                {
                                  name: "Nth Child",
                                  value: ":nth-child(n)",
                                  icon: (
                                    <Star className="h-3.5 w-3.5 text-yellow-500" />
                                  ),
                                },
                                {
                                  name: "Contains Text",
                                  value: ":contains('text')",
                                  icon: (
                                    <Star className="h-3.5 w-3.5 text-yellow-500" />
                                  ),
                                },
                              ].map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
                                  onClick={() => {
                                    if (currentSelector) {
                                      updateSelector(currentSelector.id, {
                                        selector: item.value,
                                        type: "css",
                                      });
                                    }
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    {item.icon}
                                    <span className="text-sm">{item.name}</span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="font-mono text-xs"
                                  >
                                    {item.value}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Generated Selector
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              value={currentSelector?.selector || ""}
                              onChange={(e) => {
                                if (currentSelector) {
                                  updateSelector(currentSelector.id, {
                                    selector: e.target.value,
                                    type: "css",
                                  });
                                }
                              }}
                              className="font-mono text-sm flex-1"
                              placeholder="#id .class > element"
                            />
                            <Button size="sm" variant="outline">
                              <Check className="h-4 w-4 mr-1" /> Apply
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="tester" className="space-y-4">
                        <div>
                          <Label htmlFor="testSelector">Test Selector</Label>
                          <div className="flex gap-2 mt-1">
                            <Select defaultValue="css">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="css">CSS</SelectItem>
                                <SelectItem value="xpath">XPath</SelectItem>
                                <SelectItem value="regex">Regex</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              id="testSelector"
                              placeholder="Enter selector to test"
                              className="flex-1"
                            />
                            <Button>
                              <Eye className="h-4 w-4 mr-1" /> Test
                            </Button>
                          </div>
                        </div>

                        <div className="flex-1">
                          <Label>Results</Label>
                          <div className="mt-1 border rounded-md p-3 h-[200px] overflow-auto">
                            <p className="text-sm text-gray-500 text-center mt-12">
                              Test a selector to see matching elements
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="selectorGroup" className="whitespace-nowrap">
                Selector Group:
              </Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger id="selectorGroup" className="w-[200px]">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {selectorGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSaveDialog(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> New Group
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Create a new selector group</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const json = JSON.stringify(selectors, null, 2);
                        navigator.clipboard.writeText(json);
                      }}
                      className="gap-1"
                    >
                      <FileJson className="h-4 w-4" /> Copy as JSON
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Copy selectors as JSON</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="default"
                onClick={handleSave}
                disabled={selectors.length === 0}
                className="gap-1"
              >
                <Save className="h-4 w-4" /> Save Selectors
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Tooltip */}
      <div className="fixed bottom-4 right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full h-10 w-10 shadow-lg"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <div className="space-y-2">
                <p className="font-medium">Live Selector Help</p>
                <ul className="text-xs space-y-1">
                  <li>
                    • Use <strong>Visual Selector</strong> to click and select
                    elements
                  </li>
                  <li>
                    • Switch to <strong>HTML Inspector</strong> to view and test
                    selectors
                  </li>
                  <li>• Drag and drop to reorder selectors</li>
                  <li>
                    • Click <strong>Fullscreen</strong> for a larger view
                  </li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Save Group Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Selector Group</DialogTitle>
            <DialogDescription>
              Enter a name for your new selector group
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Product Details, Article Content"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveGroup} disabled={!groupName.trim()}>
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveSelector;
