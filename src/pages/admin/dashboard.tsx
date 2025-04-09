import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  LayoutDashboard,
  Settings,
  MessageSquare,
  Code,
  BarChart3,
  FileText,
  MessageCircle,
  Globe,
  Users,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";
import DashboardHeader from "../../components/admin/DashboardHeader";
import WidgetConfigurator from "../../components/admin/WidgetConfigurator";
import ContextRulesEditor from "../../components/admin/ContextRulesEditor";
import PromptTemplates from "../../components/admin/PromptTemplates";
import AnalyticsDashboard from "../../components/admin/AnalyticsDashboard";
import EmbedCodeGenerator from "../../components/admin/EmbedCodeGenerator";
import AIResponseFormatter from "../../components/admin/AIResponseFormatter";
import ScrapingConfigurator from "../../components/admin/scraping/ScrapingConfigurator";
import SavedSelectorsPage from "../admin/scraping/selectors";
import ScrapingHistoryPage from "../admin/scraping/history";
import ScrapingProblemsPage from "../admin/scraping/problems";
import ScrapingVisualizationPage from "../admin/scraping/visualization";
import AdvancedLiveSelectorTool from "../../components/admin/scraping/AdvancedLiveSelectorTool";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [activeSubTab, setActiveSubTab] = useState("");
  const location = useLocation();

  // Handle tab activation from route state
  useEffect(() => {
    if (location.state) {
      const { activeTab, subTab } = location.state as { activeTab?: string; subTab?: string };
      if (activeTab) {
        setActiveSection(activeTab);
      }
      if (subTab) {
        setActiveSubTab(subTab);
      }
    }
  }, [location]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        userName="Admin User"
        userEmail="admin@example.com"
        onTabChange={(tab, subTab) => {
          setActiveSection(tab);
          if (subTab) {
            setActiveSubTab(subTab);
          }
        }}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden dashboard-content">
        <DashboardHeader
          title="Admin Dashboard"
          username="Admin User"
          userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
          notificationCount={3}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <Tabs
            value={activeSection}
            onValueChange={setActiveSection}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-9 mb-8 tab-theme">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="widget" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Widget Config</span>
              </TabsTrigger>
              <TabsTrigger value="context" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Context Rules</span>
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="embed" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Embed Code</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger
                value="response-formatter"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Response Formatter</span>
              </TabsTrigger>
              <TabsTrigger value="scraping" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Web Scraping</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Conversations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,248</div>
                    <p className="text-xs text-muted-foreground">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">342</div>
                    <p className="text-xs text-muted-foreground">
                      +5% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Response Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98.7%</div>
                    <p className="text-xs text-muted-foreground">
                      +0.5% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg. Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.2s</div>
                    <p className="text-xs text-muted-foreground">
                      -0.3s from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks and shortcuts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2"
                      onClick={() => setActiveSection("widget")}
                    >
                      <Settings className="h-6 w-6" />
                      Configure Widget
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2"
                      onClick={() => setActiveSection("context")}
                    >
                      <MessageSquare className="h-6 w-6" />
                      Edit Context Rules
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2"
                      onClick={() => setActiveSection("embed")}
                    >
                      <Code className="h-6 w-6" />
                      Get Embed Code
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                    <CardDescription>Current system health</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Status</span>
                      <span className="text-sm font-medium text-green-600">
                        Operational
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Gemini API</span>
                      <span className="text-sm font-medium text-green-600">
                        Connected
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Hugging Face API</span>
                      <span className="text-sm font-medium text-green-600">
                        Connected
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database</span>
                      <span className="text-sm font-medium text-green-600">
                        Healthy
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="widget">
              <WidgetConfigurator />
            </TabsContent>

            <TabsContent value="context">
              <ContextRulesEditor subTab={activeSubTab} />
            </TabsContent>

            <TabsContent value="templates">
              <PromptTemplates subTab={activeSubTab} />
            </TabsContent>

            <TabsContent value="embed">
              <EmbedCodeGenerator />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="response-formatter">
              <AIResponseFormatter />
            </TabsContent>

            <TabsContent value="scraping">
              <Tabs value={activeSubTab === "" ? "configurator" : activeSubTab} onValueChange={(value) => setActiveSubTab(value)} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="configurator">Scraping Tool</TabsTrigger>
                  <TabsTrigger value="selectors">Saved Selectors</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="problems">Problems</TabsTrigger>
                  <TabsTrigger value="visualization">Visualization</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Tool</TabsTrigger>
                </TabsList>

                <TabsContent value="configurator">
                  <Card>
                    <CardHeader>
                      <CardTitle>Web Scraping Tool</CardTitle>
                      <CardDescription>
                        Configure and run web scraping tasks to extract data from websites
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrapingConfigurator />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="selectors">
                  <SavedSelectorsPage />
                </TabsContent>

                <TabsContent value="history">
                  <ScrapingHistoryPage />
                </TabsContent>

                <TabsContent value="problems">
                  <ScrapingProblemsPage />
                </TabsContent>

                <TabsContent value="visualization">
                  <ScrapingVisualizationPage />
                </TabsContent>

                <TabsContent value="advanced">
                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Live Selector Tool</CardTitle>
                      <CardDescription>
                        Interactive tool for creating and testing complex CSS selectors
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdvancedLiveSelectorTool
                        initialUrl=""
                        onSaveSelectors={(selectors) => {
                          console.log("Saved selectors:", selectors);
                          // Handle saving selectors
                        }}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="users">
              <div className="p-6 card-theme rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6 text-foreground-color">User Management</h2>
                <p className="text-muted-color mb-4">This feature will be implemented in a future update.</p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
