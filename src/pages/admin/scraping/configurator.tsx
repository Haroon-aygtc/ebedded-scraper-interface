import React from "react";
import ScrapingConfigurator from "@/components/admin/scraping/ScrapingConfigurator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ScrapingConfiguratorPage = () => {
  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
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
    </div>
  );
};

export default ScrapingConfiguratorPage;
