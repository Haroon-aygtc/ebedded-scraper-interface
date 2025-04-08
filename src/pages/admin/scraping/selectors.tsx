import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  Copy,
  FileJson,
  Save,
  Code,
} from "lucide-react";
import { SelectorGroup, Selector } from "@/types/scraping";

const SavedSelectorsPage = () => {
  const [selectorGroups, setSelectorGroups] = useState<SelectorGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<SelectorGroup | null>(
    null,
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching selector groups
    const fetchSelectorGroups = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSelectorGroups([
          {
            id: "1",
            name: "Product Details",
            selectors: [
              {
                id: "1-1",
                name: "Product Title",
                selector: ".product-title",
                type: "css",
              },
              {
                id: "1-2",
                name: "Product Price",
                selector: ".product-price",
                type: "css",
              },
              {
                id: "1-3",
                name: "Product Description",
                selector: ".product-description",
                type: "css",
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            name: "Article Content",
            selectors: [
              {
                id: "2-1",
                name: "Article Title",
                selector: "h1.article-title",
                type: "css",
              },
              {
                id: "2-2",
                name: "Article Body",
                selector: ".article-content",
                type: "css",
              },
              {
                id: "2-3",
                name: "Article Author",
                selector: ".article-author",
                type: "css",
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "3",
            name: "E-commerce Category",
            selectors: [
              {
                id: "3-1",
                name: "Category Title",
                selector: "h1.category-title",
                type: "css",
              },
              {
                id: "3-2",
                name: "Product Cards",
                selector: ".product-card",
                type: "css",
              },
              {
                id: "3-3",
                name: "Pagination",
                selector: ".pagination a",
                type: "css",
                attribute: "href",
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      } catch (error) {
        console.error("Error fetching selector groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectorGroups();
  }, []);

  const handleViewGroup = (group: SelectorGroup) => {
    setSelectedGroup(group);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroupToDelete(groupId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteGroup = () => {
    if (groupToDelete) {
      setSelectorGroups(
        selectorGroups.filter((group) => group.id !== groupToDelete),
      );
      setShowDeleteDialog(false);
      setGroupToDelete(null);
      if (selectedGroup?.id === groupToDelete) {
        setSelectedGroup(null);
      }
    }
  };

  const handleCopySelectors = (group: SelectorGroup) => {
    const json = JSON.stringify(group.selectors, null, 2);
    navigator.clipboard.writeText(json);
    // Show a toast or notification here
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Selector Groups List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Selector Groups</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> New Group
                </Button>
              </div>
              <CardDescription>
                Saved selector groups for web scraping
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : selectorGroups.length === 0 ? (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground">
                    No selector groups found. Create your first group to get
                    started.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {selectorGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`p-3 border rounded-md cursor-pointer transition-all ${selectedGroup?.id === group.id ? "border-primary bg-primary/5" : "hover:border-gray-400"}`}
                        onClick={() => handleViewGroup(group)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{group.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {group.selectors.length} selectors
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopySelectors(group);
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteGroup(group.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
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

        {/* Selector Details */}
        <div className="md:col-span-2">
          {selectedGroup ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedGroup.name}</CardTitle>
                    <CardDescription>
                      Created on{" "}
                      {new Date(selectedGroup.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopySelectors(selectedGroup)}
                    >
                      <FileJson className="h-4 w-4 mr-2" /> Export JSON
                    </Button>
                    <Button size="sm">
                      <Edit className="h-4 w-4 mr-2" /> Edit Group
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Selector</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Attribute</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedGroup.selectors.map((selector) => (
                      <TableRow key={selector.id}>
                        <TableCell className="font-medium">
                          {selector.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {selector.selector}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {selector.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{selector.attribute || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Selector Preview</h3>
                  <Separator className="mb-4" />
                  <div className="bg-gray-50 p-4 rounded-md">
                    <pre className="text-xs font-mono overflow-x-auto">
                      {JSON.stringify(selectedGroup.selectors, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setSelectedGroup(null)}
                >
                  Back to List
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Selector
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Eye className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Group</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Select a selector group from the list to view its details and
                  manage its selectors.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Create New Group
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selector Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this selector group? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteGroup}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedSelectorsPage;
