import React from "react";
import { Link } from "react-router-dom";
import { Bell, Search, Settings, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title?: string;
  username?: string;
  userAvatar?: string;
  notificationCount?: number;
}

const DashboardHeader = ({
  title = "Admin Dashboard",
  username = "Admin User",
  userAvatar = "",
  notificationCount = 3,
}: DashboardHeaderProps) => {
  return (
    <header className="bg-card border-b border-color p-4 flex items-center justify-between w-full h-20 shadow-sm">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-foreground-color">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-color" />
          <Input
            placeholder="Search..."
            className="pl-8 h-9 w-full input-theme"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-foreground-color" />
              {notificationCount > 0 && (
                <Badge
                  className={cn(
                    "absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs",
                  )}
                  variant="destructive"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">New user registered</p>
                  <p className="text-sm text-gray-500">2 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">Context rule updated</p>
                  <p className="text-sm text-gray-500">1 hour ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">New analytics report available</p>
                  <p className="text-sm text-gray-500">Yesterday</p>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Settings */}
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/settings">
            <Settings className="h-5 w-5 text-foreground-color" />
          </Link>
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={username} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm hidden md:inline-block">
                {username}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link to="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={() => {
                logout();
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
